import { createClient } from '@supabase/supabase-js'

interface FingerspotResponse {
  success: boolean
  data: unknown
  message: string
}

export async function callFingerspot(
  url: string,
  body: Record<string, unknown>
): Promise<FingerspotResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')

  if (!settings) {
    return { success: false, data: null, message: 'Failed to read settings' }
  }

  const getSetting = (key: string) =>
    settings.find((s) => s.key === key)?.value ?? ''

  const apiKey = getSetting('api_key')
  const cloudId = getSetting('cloud_id')

  const finalBody: Record<string, unknown> = { ...body, cloud_id: cloudId }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(finalBody),
    })

    const json = await res.json()

    return {
      success: res.ok && json.status !== false,
      data: json,
      message: json.message ?? (res.ok ? 'OK' : 'Request failed'),
    }
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err instanceof Error ? err.message : 'Network error',
    }
  }
}
