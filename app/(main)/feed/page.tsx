"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/lib/supabase/client";

type Photo = {
  id: string;
  image_url: string;
  created_at: string;
  profiles: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
};

export default function FeedPage() {
  const supabase = createClient();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { ref, inView } = useInView({ threshold: 0.5 });

  // Load lần đầu
  useEffect(() => {
    loadInitialFeed();
  }, []);

  // Load more khi scroll
  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMorePhotos();
    }
  }, [inView, photos, hasMore, loadingMore, currentUser]);

  async function loadInitialFeed() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    setCurrentUser(user);

    const { data: friendships } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", user.id)
      .eq("status", "accepted");

    const friendIds = friendships?.map((f) => f.friend_id) || [];
    friendIds.push(user.id);

    const { data, error } = await supabase
      .from("photos")
      .select(`
        id,
        image_url,
        created_at,
        profiles!inner(username, full_name, avatar_url)
      `)
      .in("user_id", friendIds)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error(error);
    } else if (data) {
      setPhotos(data as Photo[]);
    }

    setLoading(false);
  }

  async function loadMorePhotos() {
    if (!currentUser || loadingMore || !hasMore || photos.length === 0) return;

    setLoadingMore(true);

    const lastCreatedAt = photos[photos.length - 1]?.created_at;
    if (!lastCreatedAt) {
      setLoadingMore(false);
      return;
    }

    const { data: friendships } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", currentUser.id)
      .eq("status", "accepted");

    const friendIds = friendships?.map((f) => f.friend_id) || [];
    friendIds.push(currentUser.id);

    const { data, error } = await supabase
      .from("photos")
      .select(`
        id,
        image_url,
        created_at,
        profiles!inner(username, full_name, avatar_url)
      `)
      .in("user_id", friendIds)
      .lt("created_at", lastCreatedAt)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error(error);
    } else if (data && data.length > 0) {
      setPhotos((prev) => [...prev, ...(data as Photo[])]);
      if (data.length < 8) setHasMore(false);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-md space-y-6 bg-neutral-100 px-4 py-5 min-h-screen pb-24">
      {photos.map((photo, index) => (
        <article
          key={photo.id}
          className="overflow-hidden rounded-[28px] bg-white shadow-lg shadow-black/5"
        >
          <div className="flex items-center gap-3 p-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-200">
              {photo.profiles?.avatar_url ? (
                <Image
                  src={photo.profiles.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-semibold text-neutral-500">
                  {(photo.profiles?.full_name || photo.profiles?.username || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">
                {photo.profiles?.full_name || photo.profiles?.username}
              </h3>
              <p className="text-xs text-neutral-500">
                {new Date(photo.created_at).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              src={photo.image_url}
              alt="Feed photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              quality={85}
              priority={index < 2}
            />
          </div>
        </article>
      ))}

      {hasMore && <div ref={ref} className="h-10" />}

      {loadingMore && (
        <div className="py-6 flex justify-center">
          <div className="animate-spin h-6 w-6 border-4 border-black border-t-transparent rounded-full" />
        </div>
      )}

      {!hasMore && photos.length > 0 && (
        <p className="text-center py-10 text-neutral-500">Đã xem hết ảnh từ bạn bè</p>
      )}
    </section>
  );
}