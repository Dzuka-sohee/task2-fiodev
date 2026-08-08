import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();

  const metrics = {
    attendanceToday: 0,
    totalEmployees: 0,
    apiRequestsToday: 0,
    webhookReceived: 0,
  };
  let attendanceTrend: { date: string; hadir: number; tidakHadir: number }[] = [];
  let recentLogs: {
    id: string;
    pin: string;
    user_name: string;
    scan_time: string;
    verify_type: string;
    status_code: string;
    device_sn: string;
  }[] = [];
  let topPerformers: { pin: string; name: string; count: number }[] = [];
  let weeklyComparison: { day: string; count: number }[] = [];

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const [attRes, usersRes, apiRes, webhookRes] = await Promise.allSettled([
      supabase
        .from('attlogs')
        .select('*', { count: 'exact', head: true })
        .gte('scan_time', todayISO),
      supabase
        .from('userinfos')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('api_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO),
      supabase
        .from('webhook_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO),
    ]);

    if (attRes.status === 'fulfilled' && attRes.value.count != null) {
      metrics.attendanceToday = attRes.value.count;
    }
    if (usersRes.status === 'fulfilled' && usersRes.value.count != null) {
      metrics.totalEmployees = usersRes.value.count;
    }
    if (apiRes.status === 'fulfilled' && apiRes.value.count != null) {
      metrics.apiRequestsToday = apiRes.value.count;
    }
    if (webhookRes.status === 'fulfilled' && webhookRes.value.count != null) {
      metrics.webhookReceived = webhookRes.value.count;
    }
  } catch {
    // metrics stay at defaults
  }

  // Attendance trend (last 30 days)
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const startDateISO = thirtyDaysAgo.toISOString();

    const { count: totalUsers } = await supabase
      .from('userinfos')
      .select('*', { count: 'exact', head: true });

    const { data: attData } = await supabase
      .from('attlogs')
      .select('scan_time')
      .gte('scan_time', startDateISO);

    const hadirMap: Record<string, number> = {};
    (attData ?? []).forEach((row: { scan_time: string }) => {
      const d = new Date(row.scan_time);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      hadirMap[key] = (hadirMap[key] || 0) + 1;
    });

    const allDays: { date: string; hadir: number; tidakHadir: number }[] = [];
    const cursor = new Date(thirtyDaysAgo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    while (cursor <= today) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      const hadir = hadirMap[key] || 0;
      allDays.push({
        date: key,
        hadir,
        tidakHadir: Math.max((totalUsers || 0) - hadir, 0),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    attendanceTrend = allDays;
  } catch {
    attendanceTrend = [];
  }

  // Recent logs
  try {
    const { data } = await supabase
      .from('attlogs')
      .select('id, pin, user_name, scan_time, verify_type, status_code, device_sn')
      .order('scan_time', { ascending: false })
      .limit(5);

    recentLogs = (data ?? []) as typeof recentLogs;
  } catch {
    recentLogs = [];
  }

  // Top performers (last 30 days)
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString();

    const { data } = await supabase
      .from('attlogs')
      .select('pin, user_name')
      .gte('scan_time', startDate);

    const grouped: Record<string, { name: string; count: number }> = {};
    (data ?? []).forEach((row: { pin: string; user_name: string }) => {
      if (!grouped[row.pin]) {
        grouped[row.pin] = { name: row.user_name, count: 0 };
      }
      grouped[row.pin].count += 1;
    });

    topPerformers = Object.entries(grouped)
      .map(([pin, { name, count }]) => ({ pin, name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  } catch {
    topPerformers = [];
  }

  // Weekly comparison (current week Mon–Sun)
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from('attlogs')
      .select('scan_time')
      .gte('scan_time', monday.toISOString())
      .lte('scan_time', sunday.toISOString());

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = new Array(7).fill(0);

    (data ?? []).forEach((row: { scan_time: string }) => {
      const d = new Date(row.scan_time);
      const diff = Math.floor(
        (d.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diff >= 0 && diff < 7) {
        counts[diff] += 1;
      }
    });

    weeklyComparison = dayNames.map((day, i) => ({
      day,
      count: counts[i],
    }));
  } catch {
    weeklyComparison = [];
  }

  return NextResponse.json({
    metrics,
    attendanceTrend,
    recentLogs,
    topPerformers,
    weeklyComparison,
  });
}
