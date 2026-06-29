import { NextResponse, NextRequest } from "next/server";
import { callFingerspot } from "@/lib/fingerspot";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { trans_id } = body;

  const supabase = await createClient();

  const { data: pendingRequest, error: reqError } = await supabase
    .from("api_requests")
    .insert({
      command: "get_all_pin",
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
      "https://developer.fingerspot.io/api/get_all_pin",
      {
        trans_id: trans_id ?? "1",
        cloud_id: "",
      }
    );

    if (result.success) {
      const responseData = result.data as Record<string, unknown>;
      const pinData = responseData?.data;

      if (Array.isArray(pinData)) {
        const pinItems = pinData as Array<{
          pin: string;
          device_sn: string;
        }>;

        const pinsToInsert = pinItems.map((item) => ({
          pin: item.pin,
          device_sn: item.device_sn,
          fetched_at: new Date().toISOString(),
        }));

        await supabase.from("pins").upsert(pinsToInsert);

        for (const item of pinItems) {
          const userinfoResult = await callFingerspot(
            "https://developer.fingerspot.io/api/get_userinfo",
            {
              trans_id: trans_id ?? "1",
              cloud_id: "",
              pin: item.pin,
            }
          );

          if (userinfoResult.success) {
            const infoData = userinfoResult.data as Record<string, unknown>;
            const info = infoData?.data as Record<string, unknown> | undefined;
            if (info) {
              await supabase.from("userinfos").upsert(
                {
                  pin: item.pin,
                  name: info.name ?? null,
                  privilege: info.privilege ?? null,
                  password: info.password ?? null,
                  card_no: info.rfid ?? null,
                  raw_payload: info,
                },
                { onConflict: "pin" }
              );
            }
          }
        }
      }
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
