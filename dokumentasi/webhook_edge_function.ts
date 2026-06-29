import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FingerspotWebhookPayload {
  event: string;
  device_sn?: string;
  data: Record<string, unknown>;
  timestamp?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function verifySignature(
  body: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const receivedSig = signatureHeader.replace("sha256=", "");
  return expectedSig === receivedSig;
}

async function handleEvent(
  payload: FingerspotWebhookPayload,
  supabase: ReturnType<typeof createClient>
): Promise<{ message: string }> {
  switch (payload.event) {
    case "attlog": {
      const { pin, user_name, scan_time, verify_type, status_code } = payload.data;
      const { error } = await supabase.from("attlogs").insert({
        pin: String(pin ?? ""),
        user_name: String(user_name ?? ""),
        scan_time: scan_time ?? new Date().toISOString(),
        verify_type: Number(verify_type ?? 0),
        status_code: Number(status_code ?? 0),
        device_sn: payload.device_sn ?? "",
        raw_payload: payload.data,
      });
      if (error) throw new Error(`DB error: ${error.message}`);
      return { message: "Attendance log saved" };
    }

    case "user.created":
    case "user.updated": {
      const { pin, name, privilege, password, card_no } = payload.data;
      const { error } = await supabase.from("userinfos").upsert(
        {
          pin: String(pin ?? ""),
          name: String(name ?? ""),
          privilege: Number(privilege ?? 1),
          password: String(password ?? ""),
          card_no: String(card_no ?? ""),
          device_sn: payload.device_sn ?? "",
          raw_payload: payload.data,
          synced_at: new Date().toISOString(),
        },
        { onConflict: "pin" }
      );
      if (error) throw new Error(`DB error: ${error.message}`);
      return { message: `User ${payload.event} saved` };
    }

    case "user.deleted": {
      const { pin } = payload.data;
      const { error } = await supabase
        .from("userinfos")
        .delete()
        .eq("pin", String(pin ?? ""));
      if (error) throw new Error(`DB error: ${error.message}`);
      return { message: "User deleted" };
    }

    case "device.offline":
    case "device.online": {
      console.log(`Device ${payload.device_sn} is ${payload.event.split(".")[1]}`);
      return { message: `Device status: ${payload.event.split(".")[1]}` };
    }

    default:
      console.warn(`Unhandled event type: ${payload.event}`);
      return { message: `Event "${payload.event}" received but not handled` };
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();

    const webhookSecret = Deno.env.get("WEBHOOK_SECRET") ?? "";
    const signature = req.headers.get("x-webhook-signature");

    if (webhookSecret) {
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const payload: FingerspotWebhookPayload = JSON.parse(rawBody);

    if (!payload.event) {
      return new Response(JSON.stringify({ error: "Missing event field" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Log webhook ke DB (sesuai schema webhook_logs)
    await supabase.from("webhook_logs").insert({
      event_type: payload.event,
      device_sn: payload.device_sn ?? "",
      status: "received",
      raw_payload: payload.data,
    });

    const result = await handleEvent(payload, supabase);

    // Update status ke processed
    await supabase
      .from("webhook_logs")
      .update({ status: "processed" })
      .eq("event_type", payload.event)
      .eq("device_sn", payload.device_sn ?? "")
      .order("created_at", { ascending: false })
      .limit(1);

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
