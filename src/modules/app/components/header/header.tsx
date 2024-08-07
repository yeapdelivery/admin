import Image from "next/image";
import StatusOpen from "../status-open";
import HourHeader from "./hour-header";

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <div
      data-cy="header-container"
      className="h-24 md:h-16 border-b border-gray-800 bg-white px-6 relative z-[1000]"
    >
      <div className="h-full items-center justify-between hidden md:flex">
        <div className="flex items-center gap-2">
          <Image src="/help.svg" alt="help" width={14.71} height={14.71} />
          <span data-cy="help">Preciso de ajuda</span>
        </div>

        <div className="flex items-center gap-4">
          <HourHeader />
          <StatusOpen />

          <hr className="border h-6 border-gray-700" />

          <div data-cy="profile" className="flex items-center gap-2">
            <span className="text-sm font-medium">{name}</span>
          </div>
        </div>
      </div>

      <div
        data-cy="logo-mobile"
        className="flex md:hidden items-end justify-center h-full py-2"
      >
        <Image
          src="https://yeap-delivery-public.s3.us-east-2.amazonaws.com/image/logo-menu.svg"
          height={42}
          width={98}
          alt="logo"
        />
      </div>
    </div>
  );
}
