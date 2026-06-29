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
    0: 'Finger',
    1: 'PIN',
    2: 'Card',
    12: 'Face',
    13: 'Vein',
    15: 'Face',
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
