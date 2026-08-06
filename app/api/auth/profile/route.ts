import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, created_at")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { fullName } = await request.json();

    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("users")
      .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: "Gagal update profile" }, { status: 500 });
    }

    return NextResponse.json({ message: "Profile berhasil diupdate" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
