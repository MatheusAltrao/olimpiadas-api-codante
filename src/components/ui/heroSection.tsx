"use client";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "./loading";
const HeroSection = () => {
  const { status } = useSession();

  const handleSignInClick = async () => {
    await signIn("google");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="container mx-auto space-y-6 px-4 text-center md:px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Bem-vindo às Olimpíadas
        </h1>
        <p className="mx-auto max-w-[800px] text-lg text-zinc-500 md:text-xl">
          Acesse os detalhes dos Jogos Olímpicos, incluindo ranking, locais e
          modalidades. Faça login com o Google para acessar informações
          detalhadas.
        </p>

        {status == "unauthenticated" && (
          <Button onClick={handleSignInClick} variant="outline">
            <ChromeIcon className="mr-2 h-5 w-5" />
            Entrar com Google
          </Button>
        )}

        {status == "authenticated" && (
          <div>
            <Link href={"/home/ranking"}>
              <Button variant="outline">Acessar métricas</Button>
            </Link>
          </div>
        )}

        {status == "loading" && (
          <Button className="gap-2" variant="outline">
            {" "}
            <Loading /> Carregando
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
