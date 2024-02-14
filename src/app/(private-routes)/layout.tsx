import { ReactNode } from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import SideBar from "@/modules/app/components/side-bar";

interface PrivateLayoutProps {
  children: ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const user = await getSession();

  if (!user) {
    redirect("/");
  }

  return (
    <SideBar img={user?.user?.picture} name={user?.user?.nickname}>
      {children}
    </SideBar>
  );
}
