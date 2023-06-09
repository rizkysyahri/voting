import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Button from "../components/Button";
import Menu from "../components/Menu";
import { LinkIcon, TrashIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useVotes from "../lib/useVotes";
import { useEffect, useState } from "react";
import moment from "moment";
import { showAlert } from "../components/Alert";
import { Votes } from "@prisma/client";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: dataVotesApi, error, isLoading } = useVotes();
  const [votes, setVotes] = useState<Votes[]>();

  const handleDelete = (code: string) => {
    showAlert({
      title: "Anda Yakin?",
      message: "ingin menghapus data ini?",
      onPositiveClick: () => {
        fetch(`/api/votes/${code}`, {
          method: "DELETE",
        })
          .then(() => {
            setVotes(votes?.filter((vote) => vote.code !== code));
            showAlert({ title: "Berhasil", message: "Data berhasil di hapus" });
          })
          .catch(() => {
            showAlert({ title: "Gagal", message: "Data gagal di hapus" });
          });
      },
    });
  };

  useEffect(() => {
    if (dataVotesApi) {
      setVotes(dataVotesApi.data);
    }
  }, [dataVotesApi]);

  return (
    <div className="container mx-auto font-mono">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu />

      {/* <Header> */}

      <div className="flex flex-col place-items-center  py-36 space-y-3 drop-shadow-2xl">
        <h1 className="text-4xl font-bold">Voting</h1>
        <h2 className="text-lg bg-zinc-200 px-3 py-1">
          Web Voting Irmas Al-Amin
        </h2>
        <Image
          alt={"Header"}
          src={"/assets/mosque.svg"}
          width={274}
          height={243}
        />

        <div className="space-x-10 drop-shadow-2xl">
          <Button
            text="Buat Vote Baru"
            className="font-bold"
            onClick={() => router.push("/vote/create")}
          />
          <Button
            text="Ikutan Vote"
            className="font-bold"
            onClick={() => router.push("/participant")}
          />
        </div>
      </div>
      {/* </Header> */}

      {/* <tabel> */}
      {session && (
        <div className="font-mono drop-shadow-2xl">
          <p className="py-5 text-lg font-bold">Vote yang saya buat</p>
          <table className="table-auto w-full border border-zinc-100 mb-10">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="p-5 text-left">No</th>
                <th className="p-5 text-left">Judul</th>
                <th className="p-5 text-left">Kandidat</th>
                <th className="p-5 text-left">Kode</th>
                <th className="p-5 text-left">Mulai</th>
                <th className="p-5 text-left">Selesai</th>
                <th className="p-5 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-zinc-100">
              {votes && votes.length > 0 ? (
                votes.map((vote: Votes, index: number) => (
                  <tr key={index}>
                    <td className="p-5 text-left">{index + 1}</td>
                    <td className="p-5 text-left text-blue-500">
                      <a href={`/vote/${vote.code}`}>{vote.title}</a>
                    </td>
                    <td className="p-5 text-left">
                      {vote.candidates.map((c: Candidate, index: number) => (
                        <span key={index}>
                          {c.name +
                            (index < vote.candidates.length - 1 ? " vs " : "")}
                        </span>
                      ))}
                    </td>
                    <td className="p-5 text-left font-bold">{vote.code}</td>
                    <td className="p-5 text-left">
                      {moment(vote.startDateTime).format("DD MMM YYYY hh:mm a")}
                    </td>
                    <td className="p-5 text-left">
                      {moment(vote.endDateTime).format("DD MMM YYYY hh:mm a")}
                    </td>
                    <td className="p-5 text-left">
                      <a href={`/participant/${vote.code}`}>
                        <LinkIcon className="w-8 h-8 p-2 hover:bg-zinc-100 rounded-lg" />
                      </a>
                      <button onClick={() => handleDelete(vote.code)}>
                        <TrashIcon className="w-8 h-8 p-2 hover:bg-zinc-100 rounded-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-5 text-center">
                    Belum ada votes yang dibuat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* </tabel> */}
    </div>
  );
};

export default Home;
