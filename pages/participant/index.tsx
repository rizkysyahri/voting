import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { showAlert } from "../../components/Alert";
import Button from "../../components/Button";
import Form from "../../components/Form";
import RestrictedPage from "../../components/RestrictedPage";

export default function Vote() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async () => {
    if (code === "") {
      showAlert({
        title: "hmm...",
        message: "Tolong masukkan kode yang benar!",
      });
      return;
    }

    await fetch(`/api/votes/${code}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.message && data?.message === "NOT_FOUND") {
          showAlert({
            title: "hmm...",
            message: "Kode yang anda masukkan salah!",
          });
          return;
        }
        router.push(`/participant/${code}`);
        return;
      });
  };

  if (!session) {
    return <RestrictedPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 container mx-auto font-mono">
      <Head>
        <title>Ikut Partisipasi</title>
      </Head>

      <Image
        alt="participant"
        src={"/assets/participant.svg"}
        width={200}
        height={180}
      />

      <h1 className="text-4xl font-bold">Ikutan Voting</h1>
      <h1 className="w-1/3 text-center">
        Untuk ikutan Voting, Kamu harus memasukkan kode voting yang sudah di
        berikan pembuat
      </h1>

      <Form
        value={code}
        onChange={setCode}
        placeHolder="Masukkan kode voting"
        className="w-1/3 mt-3"
      />

      <Button onClick={handleSubmit} text="Lanjutkan" className="w-1/3" />
      <button className="text-sm" onClick={() => router.push("/")}>
        Kembali
      </button>
    </div>
  );
}
