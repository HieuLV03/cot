"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
async function loginGoogle(){

  setLoading(true);

  const { error } = await supabase.auth.signInWithOAuth({

    provider:"google",

    options:{
      redirectTo:
        `${window.location.origin}/auth/callback`,
    },

  });


  if(error){

    alert(error.message);
    setLoading(false);

  }

}
  const router = useRouter();

  const supabase = createClient();


  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<
    "email" | "otp"
  >("email");


  const [loading, setLoading] = useState(false);



  // Gửi mã OTP
  async function sendOTP() {

    if (!email) {
      alert("Nhập email trước");
      return;
    }


    setLoading(true);


    const {
      error
    } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });



    if(error){

      alert(error.message);
      setLoading(false);
      return;

    }


    alert(
      "Mã đăng nhập đã gửi vào email"
    );


    setStep("otp");

    setLoading(false);

  }





  // Xác nhận OTP
  async function verifyOTP(){

    if(!otp){
      alert("Nhập mã OTP");
      return;
    }


    setLoading(true);


    const {
      error
    } = await supabase.auth.verifyOtp({

      email,

      token: otp,

      type:"email",

    });



    if(error){

      alert(error.message);
      setLoading(false);
      return;

    }


    router.push("/feed");
    router.refresh();

  }




  return (

    <main className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-neutral-100
      px-5
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
          Chí Cốt
        </h1>


        <p className="
          mb-6
          text-sm
          text-neutral-500
        ">
          Đăng nhập bằng email
        </p>



        {
          step === "email" && (

            <>

              <input
                type="email"
                placeholder="Email của bạn"
                className="
                  mb-4
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                "
                value={email}
                onChange={
                  e=>setEmail(e.target.value)
                }
              />


              <button
                onClick={sendOTP}
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-black
                  py-3
                  text-white
                "
              >
                {
                  loading
                  ? "Đang gửi..."
                  : "Gửi mã OTP"
                }

              </button>
<button
  onClick={loginGoogle}
  disabled={loading}
  className="
    mt-4
    w-full
    rounded-xl
    border
    py-3
    font-medium
  "
>

  Đăng nhập bằng Google

</button>

            </>

          )
        }




        {
          step === "otp" && (

            <>

              <input
                type="text"
                placeholder="Nhập mã OTP"
                className="
                  mb-4
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-center
                  text-xl
                  tracking-widest
                "
                value={otp}
                onChange={
                  e=>setOtp(e.target.value)
                }
              />


              <button
                onClick={verifyOTP}
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-black
                  py-3
                  text-white
                "
              >

                {
                  loading
                  ? "Đang xác nhận..."
                  : "Xác nhận"
                }

              </button>


            </>

          )
        }


      </div>


    </main>

  );

}