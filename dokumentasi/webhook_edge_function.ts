import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  if (url.pathname.endsWith("/anti-pause") || url.searchParams.get("ping") === "1") {
    console.log("Anti-pause ping received");
    return json({ status: "alive", time: new Date().toISOString() });
  }

  try {
    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const type: string = body.type;
    const cloudId: string = body.cloud_id;
    const data = body.data;

    if (!type) return json({ error: "Missing type" }, 400);
    if (!cloudId) return json({ error: "Missing cloud_id" }, 400);

    // ── GET USERID LIST (get_all_pin) ─────────────────────────
    if (type === "get_userid_list") {
      const pinArr: string[] = data?.pin_arr ?? [];
      const total: number = data?.total ?? pinArr.length;

      if (pinArr.length === 0) {
        console.log("get_userid_list: no pins");
        return json({ success: true });
      }

      const pinsToInsert = pinArr.map((pin: string) => ({
        pin: pin.toString(),
        device_sn: cloudId,
        fetched_at: new Date().toISOString(),
      }));

      await supabase.from("pins").delete().eq("device_sn", cloudId);

      const { error } = await supabase.from("pins").insert(pinsToInsert);

      if (error) {
        console.error("Error get_userid_list:", error);
        return json({ error: error.message }, 500);
      }

      console.log(`get_userid_list: saved ${pinsToInsert.length} pins (total: ${total})`);
      return json({ success: true });
    }

    // ── ATTLOG (realtime) ──────────────────────────────────────
    if (type === "attlog" || type === "realtime_attlog") {
      if (!data?.pin || !data?.scan) {
        console.log("attlog: skip - no pin/scan");
        return json({ success: true });
      }

      const { error } = await supabase.from("attlogs").insert({
        pin: data.pin.toString(),
        user_name: data.name ?? "",
        scan_time: data.scan,
        verify_type: Number(data.verify ?? 0),
        status_code: Number(data.status_scan ?? 0),
        device_sn: cloudId,
        raw_payload: data,
      });

      if (error) {
        console.error("Error attlog:", error);
        return json({ error: error.message }, 500);
      }

      console.log(`attlog: saved pin=${data.pin} time=${data.scan}`);
      return json({ success: true });
    }

    // ── GET ATTLOG ─────────────────────────────────────────────
    if (type === "get_attlog") {
      const rows = Array.isArray(data) ? data : data ? [data] : [];

      if (rows.length === 0) {
        console.log("get_attlog: no data rows");
        return json({ success: true });
      }

      const records = rows
        .filter((r: Record<string, unknown>) => r.pin && r.scan)
        .map((r: Record<string, unknown>) => ({
          pin: String(r.pin ?? ""),
          user_name: String(r.name ?? ""),
          scan_time: r.scan,
          verify_type: Number(r.verify ?? 0),
          status_code: Number(r.status_scan ?? 0),
          device_sn: cloudId,
          raw_payload: r,
        }));

      if (records.length === 0) {
        console.log("get_attlog: no valid records");
        return json({ success: true });
      }

      const { error } = await supabase.from("attlogs").insert(records);

      if (error) {
        console.error("Error get_attlog:", error);
        return json({ error: error.message }, 500);
      }

      console.log(`get_attlog: saved ${records.length} records`);
      return json({ success: true });
    }

    // ── GET USERINFO ───────────────────────────────────────────
    if (type === "get_userinfo") {
      if (!data?.pin) {
        console.log("get_userinfo: skip - no pin");
        return json({ success: true });
      }

      const { error } = await supabase.from("userinfos").upsert(
        {
          pin: data.pin.toString(),
          name: data.name ?? "",
          privilege: Number(data.privilege ?? 1),
          password: data.password ?? "",
          card_no: data.rfid ? String(data.rfid) : null,
          device_sn: cloudId,
          raw_payload: data,
          synced_at: new Date().toISOString(),
        },
        { onConflict: "pin" }
      );

      if (error) {
        console.error("Error get_userinfo:", error);
        return json({ error: error.message }, 500);
      }

      console.log(`get_userinfo: saved pin=${data.pin} name="${data.name}"`);
      return json({ success: true });
    }

    // ── SET USERINFO ───────────────────────────────────────────
    if (type === "set_userinfo") {
      const status = data?.status;
      console.log(`set_userinfo: status=${status}`);

      await supabase.from("command_logs").insert({
        command: "set_userinfo",
        device_sn: cloudId,
        status: status === 1 ? "success" : "failed",
        notes: `Set userinfo status: ${status}`,
        raw_payload: body,
      });

      return json({ success: true });
    }

    // ── DELETE USERINFO ────────────────────────────────────────
    if (type === "delete_userinfo") {
      const status = Number(data?.status ?? 0);
      const pin = data?.pin ?? body.pin;

      console.log(`delete_userinfo: status=${status} pin=${pin}`);

      if (status === 1 && pin) {
        const { error } = await supabase
          .from("userinfos")
          .delete()
          .eq("pin", pin.toString());

        if (error) {
          console.error("Error delete_userinfo:", error);
          return json({ error: error.message }, 500);
        }

        console.log(`delete_userinfo: deleted pin=${pin}`);
      }

      await supabase.from("command_logs").insert({
        command: "delete_userinfo",
        device_sn: cloudId,
        status: status === 1 ? "success" : "failed",
        notes: `Delete userinfo status: ${status} pin: ${pin}`,
        raw_payload: body,
      });

      return json({ success: true });
    }

    // ── SET TIME ───────────────────────────────────────────────
    if (type === "set_time") {
      const status = data?.status;
      console.log(`set_time: status=${status}`);

      await supabase.from("command_logs").insert({
        command: "set_time",
        device_sn: cloudId,
        status: status === 1 ? "success" : "failed",
        notes: `Set time status: ${status}`,
        raw_payload: body,
      });

      return json({ success: true });
    }

    // ── RESTART ────────────────────────────────────────────────
    if (type === "restart" || type === "restart_device") {
      const status = data?.status;
      console.log(`restart: status=${status}`);

      await supabase.from("command_logs").insert({
        command: "restart",
        device_sn: cloudId,
        status: status === 1 ? "success" : "failed",
        notes: `Restart status: ${status}`,
        raw_payload: body,
      });

      return json({ success: true });
    }

    // ── REGISTER ONLINE ────────────────────────────────────────
    if (type === "register_online" || type === "reg_online") {
      const status = data?.status;
      console.log(`register_online: status=${status}`);

      await supabase.from("command_logs").insert({
        command: "register_online",
        device_sn: cloudId,
        status: status === 1 ? "success" : "failed",
        notes: `Register online status: ${status}`,
        raw_payload: body,
      });

      return json({ success: true });
    }

    // ── UNKNOWN TYPE ───────────────────────────────────────────
    console.log(`Unknown type: ${type} - ignored`);
    return json({ success: true });

  } catch (e) {
    console.error("Unhandled error:", e);
    return json({ error: e.message }, 500);
  }
});
