import Head from "next/head";
import Image from "next/image";
import Button from "./Button";
import { signIn } from "next-auth/react";

export default function RestrictedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 font-mono">
      <Head>
        <title>Login dulu</title>
      </Head>

      <Image
        src={"/assets/restriced.svg"}
        alt="restricted"
        width={200}
        height={200}
      />

      <h1 className="text-4xl font-bold">Login Dulu</h1>
      <h2 className="text-lg">
        Untuk mengakses halaman ini, Kamu wajib login terlebih dahulu
      </h2>
      <Button onClick={signIn} text="Login"/>
    </div>
  );
}
