"use client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import ActiveLink from "./activeLink";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import Loading from "./loading";
import Menu from "./menu";

const Header = () => {
  const { data, status } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between px-4 pt-10">
      <h1 className="text-lg font-bold"> Olimpíadas Paris 2024</h1>

      <nav className="hidden items-center gap-3 text-sm lg:flex">
        <ActiveLink href="/home/ranking" icon="" name="Ranking" />
        <ActiveLink href="/home/disciplines" icon="" name="Modalidades" />
        <ActiveLink href="/home/venues" icon="" name="Locais" />
      </nav>

      <Button
        disabled={status == "loading"}
        onClick={handleSignOut}
        variant={"outline"}
      >
        {status == "loading" && <Loading />}

        {status == "authenticated" && (
          <div className="flex items-center gap-2">
            <div>
              {" "}
              <Avatar className="h-8 w-8">
                <AvatarImage src={data?.user?.image!} />
                <AvatarFallback>
                  {" "}
                  <Loading />{" "}
                </AvatarFallback>
              </Avatar>
            </div>

            <span className="text-sm font-medium">{data?.user?.name}</span>
          </div>
        )}
      </Button>

      <Menu />
    </header>
  );
};

export default Header;
