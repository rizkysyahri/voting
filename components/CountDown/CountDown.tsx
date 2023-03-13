import Countdown, { CountdownRendererFn } from "react-countdown";
import { start } from "repl";
import {
  STATE_NOT_STARTED,
  STATE_LOADING,
  STATE_STARTED,
  STATE_ENDED,
} from "../../pages/participant/[code]";
import CountDownRenderer from "./CountDownRenderer";

interface Props {
  className?: string;
  start: string;
  end: string;
  currentState: string;
}

export default function CountDown(props: Props) {
  const countDown: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
  }) => {
    return (
      <CountDownRenderer
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  };

  return (
    <div className={`text-center ${props.className}`}>
      {props.currentState === STATE_LOADING && <>Tunggu sebentar</>}
      {props.currentState === STATE_NOT_STARTED && (
        <div>
          <p>Voting akan dimulai pada : </p>
          <Countdown date={props.start} renderer={countDown} />
        </div>
      )}
      {props.currentState === STATE_STARTED && (
        <div>
          <p>Voting sedang berlangsung : </p>
          <Countdown date={props.end} renderer={countDown} />
        </div>
      )}
      {props.currentState === STATE_ENDED && (
        <div>
          <p>Voting telah berakhir : </p>
        </div>
      )}
    </div>
  );
}
