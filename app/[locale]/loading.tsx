import Image from "next/image";
import logo from "@/assets/logo.png";

export default function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-background">
      <div className="animate-[loading-logo_1.1s_ease-in-out_infinite]">
        <Image src={logo} alt="logo" width={140} height={140} priority />
      </div>
    </div>
  );
}
