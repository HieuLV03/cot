"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Camera, Edit3 } from "lucide-react";

type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
};

export default function ProfilePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, bio")
      .eq("id", user.id)
      .single();

    if (error) console.error(error);
    else {
      setProfile(data);
      setFormData({
        full_name: data?.full_name || "",
        username: data?.username || "",
        bio: data?.bio || "",
      });
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        username: formData.username,
        bio: formData.bio,
      })
      .eq("id", profile.id);

    if (error) alert("Cập nhật thất bại");
    else {
      alert("Đã cập nhật thông tin!");
      setIsEditing(false);
      loadProfile();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert("Upload ảnh thất bại");
    } else {
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", profile.id);

      loadProfile();
    }

    setUploading(false);
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!profile) return <div className="p-4">Không tìm thấy thông tin</div>;

  return (
    <div className="min-h-screen bg-neutral-100 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="relative h-56 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-5xl font-bold text-neutral-400">
                    {(profile.full_name || profile.username || "?").charAt(0)}
                  </div>
                )}
              </div>

              <label className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-neutral-100">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-20 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-neutral-500">@{profile.username}</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-sm bg-white border px-4 py-2 rounded-2xl"
            >
              <Edit3 size={18} />
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>

          {/* Bio */}
          <div className="mt-6">
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Viết tiểu sử của bạn..."
                className="w-full h-24 border rounded-2xl p-4 resize-none"
              />
            ) : (
              <p className="text-neutral-600 leading-relaxed">
                {profile.bio || "Chưa có tiểu sử"}
              </p>
            )}
          </div>

          {/* Form chỉnh sửa */}
          {isEditing && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-neutral-500">Tên hiển thị</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border rounded-2xl px-4 py-3 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-500">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full border rounded-2xl px-4 py-3 mt-1"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                className="w-full bg-black text-white py-4 rounded-2xl font-medium mt-4"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}