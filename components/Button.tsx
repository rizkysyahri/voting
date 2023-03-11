interface Props {
  text: string;
  type?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export default function Button(props: Props) {
  return (
    <button
      disabled={props.isLoading}
      onClick={props.onClick}
      className={`bg-black px-3 py-2 border-2 border-black text-white hover:bg-zinc-800 rounded ${
        props.type === "secondary" &&
        "bg-black px-3 py-2 border-2 border-black text-black hover:text-white hover:bg-zinc-100"
      }`} 
    >
      {props.isLoading? "Loading..." : props.text}
    </button>
  );
}
