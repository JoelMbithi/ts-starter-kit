import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main className="flex min-h-screen w-full justify-center font-inter">
   
    {children}

    <div className="flex fixed right-10  h-screen p-1 ">
      <div>
        <Image src="/icons/auth-image.svg" alt="auth-image" width={580} height={520}/>
      </div>
 
     
    </div>
   </main>
      
  );
}
