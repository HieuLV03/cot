"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Users, UserPlus, UserCheck } from "lucide-react";

type Profile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

export default function FriendsPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"friends" | "search" | "requests">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Lấy user hiện tại
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Load bạn bè
  const loadFriends = async () => {
    if (!currentUser) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("friendships")
      .select(`
        friend:profiles!friendships_friend_id_fkey (
          id, username, full_name, avatar_url
        )
      `)
      .eq("user_id", currentUser.id)
      .eq("status", "accepted");

    if (error) console.error(error);
    else if (data) {
      const friendList = data.map((item: any) => item.friend).filter(Boolean);
      setFriends(friendList);
    }
    setLoading(false);
  };

  // Load lời mời kết bạn
  const loadRequests = async () => {
    if (!currentUser) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("friendships")
      .select(`
        id,
        sender:profiles!friendships_user_id_fkey (
          id, username, full_name, avatar_url
        )
      `)
      .eq("friend_id", currentUser.id)
      .eq("status", "pending");

    if (error) console.error(error);
    else setRequests(data || []);

    setLoading(false);
  };

  // Tìm kiếm người dùng
  const handleSearch = async () => {
    if (!searchQuery.trim() || !currentUser) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
      .neq("id", currentUser.id)
      .limit(20);

    if (error) console.error(error);
    else setSearchResults(data || []);

    setLoading(false);
  };

  // Gửi lời mời
  const sendFriendRequest = async (targetId: string) => {
    if (!currentUser) return;
    const { error } = await supabase
      .from("friendships")
      .insert({ user_id: currentUser.id, friend_id: targetId, status: "pending" });

    if (error) alert("Lỗi khi gửi lời mời");
    else alert("Đã gửi lời mời kết bạn!");
  };

  // Chấp nhận lời mời
  const acceptRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);

    if (!error) {
      alert("Đã chấp nhận lời mời");
      loadRequests();
      loadFriends();
    }
  };

  // Tự động load khi đổi tab
  useEffect(() => {
    if (activeTab === "friends") loadFriends();
    if (activeTab === "requests") loadRequests();
  }, [activeTab, currentUser]);

  return (
    <div className="min-h-screen bg-neutral-100 pb-24">
      {/* Tab */}
      <div className="sticky top-0 bg-white border-b z-40">
        <div className="max-w-md mx-auto flex">
          {[
            { key: "friends", label: "Bạn bè", icon: Users },
            { key: "search", label: "Tìm bạn", icon: UserPlus },
            { key: "requests", label: "Lời mời", icon: UserCheck },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key ? "border-black text-black" : "border-transparent text-neutral-500"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Tìm bạn */}
        {activeTab === "search" && (
          <>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm theo tên hoặc username"
                className="flex-1 rounded-2xl border px-4 py-3 text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 bg-black text-white rounded-2xl font-medium"
              >
                Tìm
              </button>
            </div>

            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-3xl mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200">
                    {user.avatar_url && <Image src={user.avatar_url} alt="" width={56} height={56} className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm text-neutral-500">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  className="bg-black text-white px-5 py-2 rounded-2xl text-sm"
                >
                  Kết bạn
                </button>
              </div>
            ))}
          </>
        )}

        {/* Bạn bè */}
        {activeTab === "friends" && (
          <>
            {friends.length > 0 ? (
              friends.map((friend: Profile) => (
                <div key={friend.id} className="bg-white p-4 rounded-3xl flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200">
                    {friend.avatar_url && <Image src={friend.avatar_url} alt="" width={56} height={56} className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-semibold">{friend.full_name}</p>
                    <p className="text-sm text-neutral-500">@{friend.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-20">Chưa có bạn bè nào</p>
            )}
          </>
        )}

        {/* Lời mời */}
        {activeTab === "requests" && (
          <>
            {requests.length > 0 ? (
              requests.map((req: any) => (
                <div key={req.id} className="bg-white p-4 rounded-3xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200">
                      {req.sender?.avatar_url && (
                        <Image src={req.sender.avatar_url} alt="" width={56} height={56} className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{req.sender?.full_name}</p>
                      <p className="text-sm text-neutral-500">@{req.sender?.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="flex-1 bg-black text-white py-3 rounded-2xl text-sm font-medium"
                    >
                      Chấp nhận
                    </button>
                    <button className="flex-1 bg-neutral-200 py-3 rounded-2xl text-sm font-medium">
                      Từ chối
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-20">Không có lời mời nào</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}