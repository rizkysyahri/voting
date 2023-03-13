import { CheckIcon } from "@heroicons/react/solid";

interface Props {
  name: string;
  title?: string;
  index: number;
  percentage?: number;
  onclick?: () => void;
  isSelected: boolean;
}

export default function CandidateItems(props: Props) {
  return (
    <div className="flex flex-row border border-zinc-100 p-5 rounded-md space-x-3">
      <div className="w-12 h-12 font-bold text-lg items-center flex justify-center rounded-lg bg-zinc-100 text-center">
        {props.index}
      </div>
      <div className="w-full">
        <h3 className="text-lg font-bold">{props.name}</h3>
        <p>{props.title}</p>

        <div className="flex flex-row items-center space-x-2">
          {/* {Bar} */}

          <div className="w-full h-1 bg-zinc-100 rounded-md">
            <div
              className="h-1 bg-black rounded-full"
              style={{ width: `${props.percentage}%` }}
            ></div>
          </div>
          {/* {Bar} */}

          {/* <indicator> */}
          <p className="text-sm font-bold">
            {Intl.NumberFormat("en", { notation: "compact" }).format(
              props.percentage || 0
            )}
            %
          </p>
          {/* </indicator> */}
        </div>
      </div>

      <div
        onClick={props.onclick}
        className={`flex w-20 h-20 items-center justify-center cursor-pointer rounded-md ${
          props.isSelected
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-zinc-100 hover:bg-zinc-200"
        }`}
      >
        <CheckIcon className="w-7 h-7" />
      </div>
    </div>
  );
}
