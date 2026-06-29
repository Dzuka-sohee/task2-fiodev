import { NextRequest } from 'next/server'

export function validateWebhookSecret(req: NextRequest): boolean {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return false

  const headerSecret =
    req.headers.get('x-webhook-secret') ??
    req.headers.get('authorization')?.replace('Bearer ', '')

  return headerSecret === secret
}
