import { NextResponse, NextRequest } from "next/server";
import { callFingerspot } from "@/lib/fingerspot";
import { createClient } from "@/lib/supabase/server";

interface AttLog {
  pin: string;
  user_name: string;
  scan_time: string;
  verify_type: string;
  status_code: string;
  device_sn: string;
  raw_payload: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trans_id, start_date, end_date } = body;

  const supabase = await createClient();

  const { data: pendingRequest, error: reqError } = await supabase
    .from("api_requests")
    .insert({
      command: "get_attlog",
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
      "https://developer.fingerspot.io/api/get_attlog",
      {
        trans_id: trans_id ?? "1",
        cloud_id: "",
        start_date,
        end_date,
      }
    );

    if (result.success && Array.isArray(result.data)) {
      const logs: AttLog[] = result.data.map(
        (item: Record<string, unknown>) => ({
          pin: String(item.pin ?? ""),
          user_name: String(item.user_name ?? ""),
          scan_time: String(item.scan_time ?? ""),
          verify_type: String(item.verify_type ?? ""),
          status_code: String(item.status_code ?? ""),
          device_sn: String(item.device_sn ?? ""),
          raw_payload: item,
        })
      );

      await supabase.from("attlogs").upsert(logs, {
        onConflict: "pin,scan_time,device_sn",
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
