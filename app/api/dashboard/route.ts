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
  let attendanceTrend: { date: string; count: number }[] = [];
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
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    const funcRes = await supabase.rpc('attendance_daily_count', {
      start_date: startDate,
      end_date: endDate,
    });

    if (funcRes.error) throw funcRes.error;

    attendanceTrend = (funcRes.data ?? []).map(
      (row: { date: string; count: number }) => ({
        date: row.date,
        count: Number(row.count),
      }),
    );
  } catch {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString();

      const { data } = await supabase
        .from('attlogs')
        .select('scan_time')
        .gte('scan_time', startDate);

      const grouped: Record<string, number> = {};
      (data ?? []).forEach((row: { scan_time: string }) => {
        const day = row.scan_time.split('T')[0];
        grouped[day] = (grouped[day] || 0) + 1;
      });

      attendanceTrend = Object.entries(grouped)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      attendanceTrend = [];
    }
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
