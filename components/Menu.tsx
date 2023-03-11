import Image from "next/image";
import { useRouter } from "next/router";
import Button from "./Button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

export default function Menu() {
  const router = useRouter(); // router buat kembali ke halaman awal
  const { data: session } = useSession();

  return (
    <div className="flex justify-between py-2 font-mono m-5 ">
      <Image
        src={"/assets/frame 2.svg"}
        width={60}
        height={100}
        alt="emVote"
        onClick={() => router.push("/")} 
        className={"cursor-pointer"}
      />
      {session ? (
        <div className="relative drop-shadow-2xl ">
          <Popover>
            {({ open }: { open: boolean }) => (
              <>
                <Popover.Button
                  className={`
                  ${open ? "" : "text-opacity-80"}
                  text-gray-700 hover:text-opacity-100
                  group bg-white rounded-md inline-flex items-center text-base font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  transition ease-in-out duration-150
                `}
                >
                  <span className="pr-1">{session?.user?.name}</span>
                  <ChevronDownIcon
                    className={`
                    ${open ? "" : "text-opacity-70"}
                    ml-3 h-5 w-5 text-gray-500 group-hover:text-opacity-80
                    transition ease-in-out duration-150
                  `}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel
                    focus
                    className="absolute z-10 right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-slate-100 ring-opacity-5 divide-y divide-gray-100"
                  >
                    <div className="py-1">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        onClick={() => signOut()}
                      >
                        Logout
                      </button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      ) : (
        <Button text="Login" onClick={signIn} />
      )}
    </div>
  );
}
