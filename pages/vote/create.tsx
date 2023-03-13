import Head from "next/head";
import Image from "next/image";
import Form from "../../components/Form";
import Menu from "../../components/Menu";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CandidateForm from "../../components/Candidates/CandidateForm";
import { PlusIcon } from "@heroicons/react/solid";
import Button from "../../components/Button";
import { useSession } from "next-auth/react";
import RestrictedPage from "../../components/RestrictedPage";
import { showAlert } from "../../components/Alert";
import { useRouter } from "next/router";
registerLocale("id", id);

export default function CreateVote() {
  const { data: session } = useSession();
  const router = useRouter();
  const [startDateTime, setStartDateTime] = useState(new Date()); // Tanggal mulai
  const [endDateTime, setEndDateTime] = useState(new Date()); // Tanggal selesai
  const [candidates, setCandidates] = useState<Candidate[]>([]); // list kandidat
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const submitCandidate = (candidate: Candidate) => {
    setCandidates(
      candidates.map((c) => (c.key === candidate.key ? candidate : c))
    );
  };

  const addCandidateForm = () => {
    const newCandidate: Candidate = {
      name: "",
      key: candidates.length + 1,
      title: "",
    };
    setCandidates([...candidates, newCandidate]);
  };

  const removeCandidateForm = (key: number) => {
    // list kandidat baru kecuali dengan key diatas
    const newCandidates = candidates.filter(
      (candidate) => candidate.key !== key
    );

    // Re-arrange atau di urutkan ulang
    newCandidates.forEach((candidate, index) => {
      candidate.key = index + 1;
    });

    setCandidates(newCandidates);
  };

  const createVote = (e: any) => {
    e.preventDefault();
    //validasi
    if (title === "") {
      showAlert({ title: "Hmm", message: "Judul tidak boleh kosong" });
      return;
    }
    if (candidates.length < 2) {
      showAlert({ title: "Hmm", message: "Minimal ada 2 kandidat" });
      return;
    }
    if (startDateTime > endDateTime) {
      showAlert({
        title: "Hmm",
        message: "Tanggal mulai tidak boleh lebih besat dari tanggal selesai",
      });
      return;
    }
    if (candidates.some((c) => c.name === "")) {
      showAlert({
        title: "Hmm",
        message: "Nama kandidat tidak boleh kosong",
      });
      return;
    }

    setLoading(true);

    fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        startDateTime,
        endDateTime,
        candidates,
        publisher: session?.user?.email,
      }),
    })
      .then((data) => {
        showAlert({ title: "Yeay", message: "Voting berhasil dibuat " });
        router.push("/");
      })
      .catch(() => {
        showAlert({ title: "hmm", message: "Voting gagal dibuat " });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!session) {
    return <RestrictedPage />;
  }

  return (
    <div className="container mx-auto font-mono">
      <Head>
        <title>Voting Baru</title>
      </Head>

      <Menu />

      <div className="py-10 justify-items-center">
        <Image
          alt="Create Vote"
          src={"/assets/create-vote.svg"}
          width={284}
          height={198}
        />
        <h1 className="text-4xl font-bold">Buat Voting Baru </h1>
        <h2 className="text-zinc-700 mt-3">
          Silahkan masukkan data yang dibutuhkan sebelum membuat vote online
        </h2>
      </div>

      <form className="flex flex-col" onSubmit={createVote}>
        {/* {Detail vote} */}

        <div className="space-y-5">
          <h3 className="font-medium text-xl mt-10">Detail Voting</h3>
          <div className="flex flex-col">
            <label className="text-sm mt-5">Judul</label>
            <Form
              onChange={(e) => {
                setTitle(e);
              }}
              value={title}
              placeHolder={"Contoh: Voting Calon Ketua Irmas"}
              className={"mt-1 w-1/2"}
            />
          </div>
          <div className="flex flex-col w-2/3">
            <label className="text-sm">Kapan dimulai</label>
            <div className="inline-flex">
              <ReactDatePicker
                locale={"id"}
                showTimeSelect
                dateFormat={"Pp"}
                selected={startDateTime}
                onChange={(date) => date && setStartDateTime(date)}
                minDate={new Date()}
                className={"w-full bg-zinc-100 py-2 px-3"}
              />
              <span className="text-sm text-center p-3">sampai</span>
              <ReactDatePicker
                locale={"id"}
                showTimeSelect
                dateFormat={"Pp"}
                selected={endDateTime}
                onChange={(date) => date && setEndDateTime(date)}
                minDate={startDateTime}
                className={"w-full bg-zinc-100 py-2 px-3"}
              />
            </div>
          </div>
        </div>

        {/* {/Detail vote} */}

        {/* {Kandidat} */}
        <h3 className="font-medium text-xl mt-10">Kandidat</h3>
        <div className="grid gap-4 grid-cols-4 mt-5">
          {candidates.map((candidate, index) => (
            <CandidateForm
              key={index}
              candidate={candidate}
              submitCandidate={submitCandidate}
              removeCandidateForm={removeCandidateForm}
            />
          ))}
          <div
            className="w-1/3 flex flex-col items-center justify-center cursor-pointer bg-zinc-100 aspect-square text-zinc-300 hover:bg-black hover:text-white rounded-full"
            onClick={addCandidateForm}
          >
            <PlusIcon className="w-1/3" />
          </div>
        </div>
        {/* {/Kandidat} */}

        <div className="text-right mt-10 mb-10">
          <Button text="Buat Voting" isLoading={loading} />
        </div>
      </form>
    </div>
  );
}
