import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";
import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <Header />
      <PrimeReactProvider>
        <div className="px-4 py-10">
          {children} <Footer />
        </div>
      </PrimeReactProvider>
    </div>
  );
};

export default HomeLayout;
