"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {

  const router = useRouter();

  const supabase = createClient();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  async function handleRegister() {

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }


    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }


    setLoading(true);


    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
    });


    if (error) {

      alert(error.message);
      setLoading(false);
      return;

    }


    alert(
      "Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản."
    );


    router.push("/login");
    router.refresh();

  }


  return (
    <main className="
      flex
      min-h-screen
      items-center
      justify-center
      px-5
      bg-neutral-100
    ">

      <div className="
        w-full
        max-w-sm
        rounded-3xl
        bg-white
        p-6
        shadow
      ">

        <h1 className="
          mb-2
          text-3xl
          font-bold
        ">
          Tạo tài khoản
        </h1>


        <p className="
          mb-6
          text-sm
          text-neutral-500
        ">
          Tham gia Locket Mini ngay hôm nay
        </p>


        <input
          type="email"
          placeholder="Email"
          className="
            mb-3
            w-full
            rounded-xl
            border
            px-4
            py-3
          "
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />


        <input
          type="password"
          placeholder="Mật khẩu"
          className="
            mb-5
            w-full
            rounded-xl
            border
            px-4
            py-3
          "
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />


        <button
          onClick={handleRegister}
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-black
            py-3
            text-white
            disabled:opacity-50
          "
        >
          {
            loading
              ? "Đang tạo..."
              : "Đăng ký"
          }
        </button>


        <Link
          href="/login"
          className="
            mt-5
            block
            text-center
            text-sm
            text-neutral-500
          "
        >
          Đã có tài khoản? Đăng nhập
        </Link>


      </div>

    </main>
  );
}