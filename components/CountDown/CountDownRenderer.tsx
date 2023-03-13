import CountDownItem from "./CountDownItem";

interface Props {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountDownRenderer(props: Props) {
  return (
    <div className="flex flex-row mx-auto justify-center ">
      {props.days > 0 && <CountDownItem label="Hari" value={props.days} />}
      {props.hours > 0 && <CountDownItem label="Jam" value={props.hours} />}
      {props.minutes > 0 && (
        <CountDownItem label="menit" value={props.minutes} />
      )}
      {props.seconds > 0 && (
        <CountDownItem label="detik" value={props.seconds} />
      )}
    </div>
  );
}
