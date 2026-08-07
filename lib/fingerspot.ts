import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface FingerspotResponse {
  success: boolean
  data: unknown
  message: string
}

export async function callFingerspot(
  url: string,
  body: Record<string, unknown>,
  supabaseClient?: SupabaseClient
): Promise<FingerspotResponse> {
  const supabase = supabaseClient ?? createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  console.log('[callFingerspot] Reading settings from DB...')
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('cloud_id, api_key')
    .limit(1)
    .single()

  if (settingsError) {
    console.error('[callFingerspot] Settings error:', settingsError.message)
    return { success: false, data: null, message: `Settings error: ${settingsError.message}` }
  }

  if (!settings) {
    console.error('[callFingerspot] Settings returned null')
    return { success: false, data: null, message: 'Failed to read settings: no data returned' }
  }

  console.log('[callFingerspot] Settings loaded')

  const apiKey = settings.api_key || ''
  const cloudId = settings.cloud_id || ''

  if (!apiKey) {
    console.error('[callFingerspot] API Key is empty!')
    return { success: false, data: null, message: 'API Key belum dikonfigurasi di Pengaturan' }
  }

  if (!cloudId) {
    console.error('[callFingerspot] Cloud ID is empty!')
    return { success: false, data: null, message: 'Cloud ID belum dikonfigurasi di Pengaturan' }
  }

  const finalBody: Record<string, unknown> = { ...body, cloud_id: cloudId }

  console.log('[callFingerspot] Calling:', url)
  console.log('[callFingerspot] Body:', JSON.stringify(finalBody))
  console.log('[callFingerspot] Auth: Bearer', apiKey.substring(0, 4) + '...')

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

    console.log('[callFingerspot] Response status:', res.status)
    console.log('[callFingerspot] Response body:', JSON.stringify(json).substring(0, 500))

    return {
      success: res.ok && json.status !== false,
      data: json,
      message: json.message ?? (res.ok ? 'OK' : 'Request failed'),
    }
  } catch (err) {
    console.error('[callFingerspot] Network error:', err)
    return {
      success: false,
      data: null,
      message: err instanceof Error ? err.message : 'Network error',
    }
  }
}
