import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Password lama dan baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current password hash
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", user.id)
      .single();

    if (fetchError || !userData) {
      return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, userData.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Password lama salah" }, { status: 400 });
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json({ error: "Gagal update password" }, { status: 500 });
    }

    return NextResponse.json({ message: "Password berhasil diubah" });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
