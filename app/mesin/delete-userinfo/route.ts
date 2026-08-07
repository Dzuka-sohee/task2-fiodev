import { NextResponse, NextRequest } from "next/server";
import { callFingerspot } from "@/lib/fingerspot";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trans_id, pin } = body;

  const supabase = await createClient();

  const { data: pendingRequest, error: reqError } = await supabase
    .from("api_requests")
    .insert({
      command: "delete_userinfo",
      raw_payload: body,
      status: "pending",
    })
    .select()
    .single();

  if (reqError) {
    return NextResponse.json(
      { success: false, message: `Gagal insert request: ${reqError.message}` },
      { status: 500 }
    );
  }

  const { data: pendingLog, error: logError } = await supabase
    .from("command_logs")
    .insert({
      command: "delete_userinfo",
      raw_payload: body,
      status: "pending",
    })
    .select()
    .single();

  if (logError) {
    return NextResponse.json(
      { success: false, message: `Gagal insert log: ${logError.message}` },
      { status: 500 }
    );
  }

  try {
    const result = await callFingerspot(
      "https://developer.fingerspot.io/api/delete_userinfo",
      {
        trans_id: trans_id ?? "1",
        pin,
      },
      supabase
    );

    const finalStatus = result.success ? "success" : "failed";

    await supabase
      .from("api_requests")
      .update({ status: finalStatus, response: result.data })
      .eq("id", pendingRequest.id);

    await supabase
      .from("command_logs")
      .update({ status: finalStatus, notes: result.message })
      .eq("id", pendingLog.id);

    if (result.success && pin) {
      await supabase
        .from("userinfos")
        .delete()
        .eq("pin", pin.toString());
    }

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "User berhasil dihapus dari mesin dan database."
        : result.message,
      requestId: pendingRequest.id,
    });
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

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
