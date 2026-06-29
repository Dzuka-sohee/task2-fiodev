import { NextResponse, NextRequest } from "next/server";
import { callFingerspot } from "@/lib/fingerspot";
import { createClient } from "@/lib/supabase/server";

interface UserinfoItem {
  pin: string;
  name: string;
  password: string;
  card_no: string;
  privilege: string;
  enabled: string;
  device_sn: string;
  raw_payload: Record<string, unknown>;
  synced_at: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trans_id, pin } = body;

  const supabase = await createClient();

  const { data: pendingRequest, error: reqError } = await supabase
    .from("api_requests")
    .insert({
      command: "get_userinfo",
      raw_payload: body,
      status: "pending",
    })
    .select()
    .single();

  if (reqError) {
    return NextResponse.json({ error: reqError.message }, { status: 500 });
  }

  try {
    const result = await callFingerspot(
      "https://developer.fingerspot.io/api/get_userinfo",
      {
        trans_id: trans_id ?? "1",
        cloud_id: "",
        pin,
      }
    );

    if (result.success && Array.isArray(result.data)) {
      const users: UserinfoItem[] = result.data.map(
        (item: Record<string, unknown>) => ({
          pin: String(item.pin ?? ""),
          name: String(item.name ?? ""),
          password: String(item.password ?? ""),
          card_no: String(item.card_no ?? ""),
          privilege: String(item.privilege ?? ""),
          enabled: String(item.enabled ?? ""),
          device_sn: String(item.device_sn ?? ""),
          raw_payload: item,
          synced_at: new Date().toISOString(),
        })
      );

      await supabase.from("userinfos").upsert(users, {
        onConflict: "pin",
      });
    }

    const finalStatus = result.success ? "success" : "failed";

    await supabase
      .from("api_requests")
      .update({ status: finalStatus, response: result.data })
      .eq("id", pendingRequest.id);

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await supabase
      .from("api_requests")
      .update({ status: "failed", response: { error: errorMessage } })
      .eq("id", pendingRequest.id);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
