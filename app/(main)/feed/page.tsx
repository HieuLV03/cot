import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="p-5">
        Chưa đăng nhập
      </section>
    );
  }

  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id")
    .eq("user_id", user.id)
    .eq("status", "accepted");

  const friendIds =
    friendships?.map((item) => item.friend_id) || [];

  friendIds.push(user.id);

  const { data: photos, error } = await supabase
    .from("photos")
    .select(`
      id,
      image_url,
      created_at,
      profiles(
        username,
        full_name,
        avatar_url
      )
    `)
    .in("user_id", friendIds)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <section className="p-5">
        {error.message}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md space-y-6 bg-neutral-100 px-4 py-5 min-h-screen">

      {photos?.map((photo: any) => (

        <article
          key={photo.id}
          className="
            overflow-hidden
            rounded-[28px]
            bg-white
            shadow-lg
            shadow-black/5
          "
        >

          {/* Header */}

          <div className="flex items-center gap-3 p-4">

            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-200">

              {photo.profiles?.avatar_url ? (

                <Image
                  src={photo.profiles.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                />

              ) : (

                <div className="flex h-full w-full items-center justify-center font-semibold text-neutral-500">

                  {(photo.profiles?.full_name ||
                    photo.profiles?.username ||
                    "?")
                    .charAt(0)
                    .toUpperCase()}

                </div>

              )}

            </div>

            <div>

              <h3 className="font-semibold">

                {photo.profiles?.full_name ||
                  photo.profiles?.username}

              </h3>

              <p className="text-xs text-neutral-500">

                {new Date(photo.created_at).toLocaleString(
                  "vi-VN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}

              </p>

            </div>

          </div>

          {/* Image */}

          <div className="relative aspect-square">

            <Image
              src={photo.image_url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />

          </div>

        </article>

      ))}

      {photos?.length === 0 && (

        <div className="rounded-3xl bg-white p-12 text-center shadow">

          <h2 className="text-xl font-semibold">
            📸
          </h2>

          <p className="mt-3 text-neutral-500">
            Chưa có ảnh nào từ bạn bè.
          </p>

        </div>

      )}

    </section>
  );
}