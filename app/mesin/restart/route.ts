import { NextResponse, NextRequest } from "next/server";
import { callFingerspot } from "@/lib/fingerspot";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trans_id } = body;

  const supabase = await createClient();

  const { data: pendingLog, error: logError } = await supabase
    .from("command_logs")
    .insert({
      command: "restart",
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
      "https://developer.fingerspot.io/api/restart_device",
      {
        trans_id: trans_id ?? "1",
        cloud_id: "",
      }
    );

    const finalStatus = result.success ? "success" : "failed";

    await supabase
      .from("command_logs")
      .update({ status: finalStatus, notes: result.message })
      .eq("id", pendingLog.id);

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await supabase
      .from("command_logs")
      .update({ status: "failed", notes: errorMessage })
      .eq("id", pendingLog.id);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
