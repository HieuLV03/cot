import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {

  const supabase = await createClient();

  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <section className="p-4">
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 p-4">

      {photos?.map((photo) => (

        <div
          key={photo.id}
          className="overflow-hidden rounded-3xl bg-white shadow-sm"
        >

          <div className="relative aspect-square">

            <Image
              src={photo.image_url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />

          </div>

          <div className="p-4">

            <p className="font-semibold">
              {photo.user_name}
            </p>

            <p className="text-sm text-neutral-500">
              {new Date(
                photo.created_at
              ).toLocaleString()}
            </p>

          </div>

        </div>

      ))}

      {photos?.length === 0 && (

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Welcome 👋
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Chưa có bài viết nào.
          </p>

        </div>

      )}

    </section>
  );

}