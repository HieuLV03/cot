"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

type Post = {
  id: string;
  image_url: string;
  content?: string | null;
  created_at: string;
  profiles: Profile | null;
};

export default function FeedPage() {
  const supabase = createClient();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    loadInitialFeed();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMorePosts();
    }
  }, [inView]);

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
      .from("posts")
      .select(`
        id,
        image_url,
        content,
        created_at,
        profiles!inner(username, full_name, avatar_url)
      `)
      .in("user_id", friendIds)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error(error);
    } else if (data) {
      setPosts(data as Post[]);
    }

    setLoading(false);
  }

  async function loadMorePosts() {
    if (!currentUser || loadingMore || !hasMore || posts.length === 0) return;

    setLoadingMore(true);

    const lastCreatedAt = posts[posts.length - 1]?.created_at;
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
      .from("posts")
      .select(`
        id,
        image_url,
        content,
        created_at,
        profiles!inner(username, full_name, avatar_url)
      `)
      .in("user_id", friendIds)
      .lt("created_at", lastCreatedAt)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error(error);
    } else if (data) {
      setPosts((prev) => [...prev, ...(data as Post[])]);
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
      {posts.map((post, index) => (
        <article
          key={post.id}
          className="overflow-hidden rounded-[28px] bg-white shadow-lg shadow-black/5"
        >
          <div className="flex items-center gap-3 p-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-200">
              {post.profiles?.avatar_url ? (
                <Image
                  src={post.profiles.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-semibold text-neutral-500">
                  {(post.profiles?.full_name || post.profiles?.username || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">
                {post.profiles?.full_name || post.profiles?.username}
              </h3>
              <p className="text-xs text-neutral-500">
                {new Date(post.created_at).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              src={post.image_url}
              alt="Post"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              quality={85}
              priority={index < 2}
            />
          </div>

          {post.content && (
            <div className="p-4 text-[15px] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          )}
        </article>
      ))}

      {hasMore && <div ref={ref} className="h-10" />}

      {loadingMore && (
        <div className="py-6 flex justify-center">
          <div className="animate-spin h-6 w-6 border-4 border-black border-t-transparent rounded-full" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center py-10 text-neutral-500">Đã xem hết bài viết</p>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-2xl">📸</p>
          <p className="mt-3 text-neutral-500">Chưa có bài viết nào từ bạn bè</p>
        </div>
      )}
    </section>
  );
}