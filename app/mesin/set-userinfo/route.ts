import { NextResponse, NextRequest } from "next/server";
import { callFingerspot } from "@/lib/fingerspot";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trans_id, pin, name, privilege, password, rfid, template } = body;

  const supabase = await createClient();

  const { data: pendingRequest, error: reqError } = await supabase
    .from("api_requests")
    .insert({
      command: "set_userinfo",
      raw_payload: body,
      status: "pending",
    })
    .select()
    .single();

  if (reqError) {
    return NextResponse.json({ error: reqError.message }, { status: 500 });
  }

  const { data: pendingLog, error: logError } = await supabase
    .from("command_logs")
    .insert({
      command: "set_userinfo",
      raw_payload: body,
      status: "pending",
    })
    .select()
    .single();

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  try {
    const result = await callFingerspot(
      "https://developer.fingerspot.io/api/set_userinfo",
      {
        trans_id: trans_id ?? "1",
        cloud_id: "",
        data: { pin, name, privilege, password, rfid, template },
      }
    );

    if (result.success) {
      await supabase.from("userinfos").upsert(
        { pin, name, privilege, password, card_no: rfid, raw_payload: result.data },
        { onConflict: "pin" }
      );
    }

    const finalStatus = result.success ? "success" : "failed";

    await supabase
      .from("api_requests")
      .update({ status: finalStatus, response: result.data })
      .eq("id", pendingRequest.id);

    await supabase
      .from("command_logs")
      .update({ status: finalStatus, notes: result.message })
      .eq("id", pendingLog.id);

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await supabase
      .from("api_requests")
      .update({ status: "failed", response: { error: errorMessage } })
      .eq("id", pendingRequest.id);

    await supabase
      .from("command_logs")
      .update({ status: "failed", notes: errorMessage })
      .eq("id", pendingLog.id);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
