import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { showAlert } from "../../components/Alert";
import Button from "../../components/Button";
import CandidateItems from "../../components/Candidates/CandidateItems";
import CountDown from "../../components/CountDown/CountDown";
import Menu from "../../components/Menu";
import RestrictedPage from "../../components/RestrictedPage";
import useVote from "../../lib/useVote";

export default function detailParticipant() {
  const router = useRouter();
  const { code } = router.query;
  const { data: dataVoteAPi } = useVote(code as string);

  const { data: session } = useSession();

  if (!session) {
    return <RestrictedPage />;
  }

  return (
    <div className="container mx-auto font-mono">
      <Head>
        <title>Mulai voting</title>
      </Head>

      <Menu />

      <div>
        <h1 className="text-4xl mt-10 text-center">Pemilihan Ketua Irmas</h1>

        {/* {Timer} */}

        <CountDown className="mt-10" />

        {/* {Timer} */}

        {/* {Candidate} */}
        <div className="mt-10 space-y-3 mx-auto w-2/3">
          <CandidateItems />
          <CandidateItems />
          <CandidateItems />
          <CandidateItems />
        </div>
        {/* {Candidate} */}

        {/* <submit> */}
        <div className="text-center mt-10 mb-10">
          <Button
            text="Kirim Vote Saya 🙂"
            onClick={() =>
              showAlert({
                title: "Apakah kamu yakin ?",
                message: "Kamu akan memilih Kandidat 1",
                positiveBtnText: "Ya",
                onPositiveClick() {},
              })
            }
          />
        </div>
        {/* </submit> */}
      </div>
    </div>
  );
}
