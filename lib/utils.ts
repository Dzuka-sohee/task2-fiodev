import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatScanTime(isoString: string): string {
  const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
  if (!match) return isoString
  const [, year, month, day, hour, min, sec] = match
  const d = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(min), Number(sec))
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatScanTimeShort(isoString: string): string {
  const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
  if (!match) return isoString
  const [, year, month, day, hour, min] = match
  const d = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(min))
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatVerifyType(code: number): string {
  const map: Record<number, string> = {
    1: 'Finger',
    2: 'Password',
    3: 'Card',
    4: 'Face',
    6: 'Vein',
    7: 'QR',
  }
  return map[code] ?? `Type ${code}`
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'Menunggu',
    success: 'Berhasil',
    failed: 'Gagal',
    received: 'Diterima',
    processed: 'Diproses',
  }
  return map[status] ?? status
}
