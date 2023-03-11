import {zeroPad} from "react-countdown"

interface ItemProps {
  value: number;
  label: string;
}

export default function CountDownItem(props: ItemProps)  {
  return (
    <div className="flex items-center">
      <div className="flex flex-col text-center">
        <span className="text-5xl font-bold">{zeroPad(props.value, 2)}</span>
        <span className="text-xl font-light">{props.label}</span>
      </div>
      {props.label !== "detik" && <span className="mx-5 text-4xl">:</span>}
    </div>
  );
};
