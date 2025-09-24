import Image from "next/image";
import Sidebar from "../../components/Sidebar/Sidebar";
import MobileNav from "@/components/MobileNav/MobileNav";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: "Joe", lastName:"Mbithi" };
  return (
    <main className=" flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
     
     <div className="flex  size-full flex-col">
      <div className="p-4 shadow  flex items-center justify-between">
        <Image src={"/icons/logo.svg"} alt="logo" width={30} height={30}/>
        <div>
          <MobileNav user={loggedIn}/>
        </div>
      </div>
      {children}
     </div>
    </main>
  );
}
