import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { showAlert } from "../../components/Alert";
import Button from "../../components/Button";
import CandidateItems from "../../components/Candidates/CandidateItems";
import CountDown from "../../components/CountDown/CountDown";
import Menu from "../../components/Menu";
import RestrictedPage from "../../components/RestrictedPage";
import useVote from "../../lib/useVote";
import useParticipant from "../../lib/useParticipant";

export const STATE_NOT_STARTED = "STATE_NOT_STARTED",
  STATE_STARTED = "STATE_STARTED",
  STATE_ENDED = "STATE_ENDED",
  STATE_LOADING = "STATED_LOADING";

export default function detailParticipant() {
  const router = useRouter();
  const { code } = router.query;
  const { data: dataVoteAPi, mutate: mutateVoteApi } = useVote(code as string);
  const { data: dataParticipantApi, mutate: mutateParticipant } =
    useParticipant(code as string);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  const submitVote = () => {
    if (selectedCandidate) {
      showAlert({
        title: "Apakah kamu yakin?",
        message: "Kamu akan memilih kandidat" + selectedCandidate.name,
        positiveBtnText: "Ya, Saya yakin!",
        onPositiveClick: async () => {
          const res = await fetch(
            "/api/participant/" + dataVoteAPi?.data?.code,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                candidate: selectedCandidate.name,
              }),
            }
          );

          if (res.status === 200) {
            mutateVoteApi();
            mutateParticipant();

            showAlert({
              title: "Vote terkirim",
              message: "Terima kasih telah berpartisipasi 😊",
            });
          }
        },
      });
    } else {
      showAlert({
        title: "Vote gagal ❌",
        message: "Mohon pilih salah satu kandidat",
      });
    }
  };

  const [currentState, setCurrentState] = useState(STATE_LOADING);

  useEffect(() => {
    if (dataVoteAPi && dataVoteAPi.data) {
      const vote = dataVoteAPi.data;
      if (currentState === STATE_ENDED) {
        return;
      }

      const start = moment(vote?.startDateTime);
      const end = moment(vote?.endDateTime);

      const interval = setInterval(async () => {
        const now = moment();

        if (now.isBefore(start)) {
          setCurrentState(STATE_NOT_STARTED);
        } else if (now.isAfter(start) && now.isBefore(end)) {
          setCurrentState(STATE_STARTED);
        } else if (now.isAfter(end)) {
          setCurrentState(STATE_ENDED);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataVoteAPi]);

  useEffect(() => {
    if (dataParticipantApi && dataVoteAPi) {
      const candidate = dataVoteAPi.data?.candidates?.find(
        (c) => c.name === dataParticipantApi?.data?.candidate
      );

      if (candidate) {
        setSelectedCandidate(candidate);
      }
    }
  }, [dataParticipantApi, dataVoteAPi]);

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
        <h1 className="text-4xl mt-10 text-center">
          {dataVoteAPi?.data?.title}
        </h1>

        {/* {Timer} */}

        <CountDown
          start={String(dataVoteAPi?.data?.startDateTime)}
          end={String(dataVoteAPi?.data?.endDateTime)}
          currentState={currentState}
          className="mt-10"
        />

        {/* {Timer} */}

        {/* {Candidate} */}
        <div className="mt-10 space-y-3 mx-auto w-2/3">
          {dataVoteAPi?.data?.candidates.map(
            (candidate: Candidate, index: number) => (
              <CandidateItems
                onclick={() => {
                  !dataParticipantApi?.data &&
                    currentState === STATE_STARTED &&
                    setSelectedCandidate(candidate);
                }}
                isSelected={selectedCandidate?.name === candidate.name}
                name={candidate.name}
                index={candidate.key}
                title={"kandidat" + candidate.key}
                percentage={
                  candidate.votes
                    ? (candidate.votes / (dataVoteAPi?.data?.totalVotes || 0)) *
                      100
                    : 0
                }
                key={index}
              />
            )
          )}
        </div>
        {/* {Candidate} */}

        {/* <submit> */}
        <div className="text-center mt-10 mb-10">
          {session?.user?.email != dataVoteAPi?.data?.publisher &&
            !dataParticipantApi?.data &&
            currentState === STATE_STARTED && (
              <Button
                text="Kirim Vote Saya 🙂"
                onClick={() => {
                  submitVote();
                }}
              />
            )}

          {dataParticipantApi?.data && (
            <span className="bg-zinc-100 py-2 px-3">
              Kamu sudah memilih, dan tidak diperbolehkan untuk mengganti
              pilihan
            </span>
          )}

          {session?.user?.email === dataVoteAPi?.data?.publisher && (
            <span className="bg-zinc-100 py-2 px-3">
              Pembuat vote tidak dapat melakukan voting
            </span>
          )}
        </div>
        {/* </submit> */}
      </div>
    </div>
  );
}
