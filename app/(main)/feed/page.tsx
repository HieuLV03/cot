import Image from "next/image";

import { createClient } from "@/lib/supabase/server";


export default async function FeedPage() {

  const supabase = await createClient();


  // 1. Lấy user hiện tại

  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    return (
      <section className="p-4">
        Chưa đăng nhập
      </section>
    );

  }



  // 2. Lấy danh sách bạn bè

  const {
    data: friendships
  } = await supabase
    .from("friendships")
    .select("friend_id")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "status",
      "accepted"
    );



  const friendIds =
    friendships?.map(
      item => item.friend_id
    ) || [];



  // thêm chính mình

  friendIds.push(user.id);



  // 3. Lấy ảnh của mình + bạn bè

  const {
    data: photos,
    error
  } = await supabase
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
    .in(
      "user_id",
      friendIds
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );



  if(error){

    return (
      <section className="p-4">
        {error.message}
      </section>
    );

  }



  return (

    <section className="space-y-4 p-4">


      {photos?.map((photo:any)=>(

        <div
          key={photo.id}
          className="
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-sm
          "
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

              {
                photo.profiles?.full_name ||
                photo.profiles?.username ||
                "Người dùng"
              }

            </p>


            <p className="text-sm text-neutral-500">

              {
                new Date(
                  photo.created_at
                ).toLocaleString("vi-VN")
              }

            </p>


          </div>


        </div>

      ))}



      {
        photos?.length===0 && (

          <div className="
            rounded-3xl
            bg-white
            p-6
          ">

            Chưa có ảnh nào

          </div>

        )
      }


    </section>

  );

}