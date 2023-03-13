import Head from "next/head";
import Image from "next/image";
import Form from "../../components/Form";
import Menu from "../../components/Menu";
import id from "date-fns/locale/id";
import useVote from "../../lib/useVote";
import Button from "../../components/Button";
import RestrictedPage from "../../components/RestrictedPage";
import CandidateForm from "../../components/Candidates/CandidateForm";
import { PlusIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { showAlert } from "../../components/Alert";
import { useEffect, useState } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("id", id);

export default function DetailOrEditVote() {
  const { data: session } = useSession();

  const [startDateTime, setStartDateTime] = useState(new Date()); // Tanggal mulai
  const [endDateTime, setEndDateTime] = useState(new Date()); // Tanggal selesai
  const [candidates, setCandidates] = useState<Candidate[]>([]); // list kandidat
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { code } = router.query;
  const { data: dataVoteApi, error } = useVote(code as string);

  useEffect(() => {
    if (dataVoteApi && dataVoteApi.data) {
      const d = dataVoteApi.data;
      setTitle(d.title);
      setStartDateTime(new Date(d.startDateTime));
      setEndDateTime(new Date(d.endDateTime));
      setCandidates(d.candidates);
    }
  }, [dataVoteApi]);

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

  const UpdateVote = (e: any) => {
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

    fetch(("/api/votes/" + code) as string, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        startDateTime,
        endDateTime,

        candidates: candidates.map((c) => ({
          name: c.name,
          title: c.title,
          key: c.key,
        })),
      }),
    })
      .then((data) => {
        showAlert({ title: "Yeay", message: "Voting berhasil di ubah " });
        router.push("/");
      })
      .catch(() => {
        showAlert({ title: "hmmm", message: "Voting berhasil di ubah " });
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
        <title>Update Voting</title>
      </Head>

      <Menu />

      <div className="py-10 ">
        <Image
          alt="Create Vote"
          src={"/assets/create-vote.svg"}
          width={284}
          height={198}
        />
        <h1 className="text-4xl font-bold">Update Voting </h1>
        <h2 className="text-zinc-700 mt-3">
          Silahkan masukkan data yang dibutuhkan sebelum membuat vote online
        </h2>
      </div>

      <form className="flex flex-col" onSubmit={UpdateVote}>
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
          <Button text="Ubah Voting" isLoading={loading} />
        </div>
      </form>
    </div>
  );
}
