"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Calendar,
  Dumbbell,
  LogOut,
  MapPin,
  Menu as MenuICon,
  Trophy,
  User,
} from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import DropdownTheme from "../theme/DropdownTheme";
import { Button } from "../ui/button";
import ActiveLink from "./activeLink";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Divider from "./divider";
import Loading from "./loading";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { data, status } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2" variant={"outline"}>
          <MenuICon size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-8">
        <SheetHeader className="space-y-8">
          <div>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Mude a sua sessão por aqui.</SheetDescription>
          </div>
          <div>
            {status == "loading" && <Loading />}

            {status == "authenticated" && (
              <div className="flex items-center gap-2">
                <div>
                  {" "}
                  <Avatar className="w-21 h-12">
                    <AvatarImage src={data?.user?.image!} />
                    <AvatarFallback>
                      {" "}
                      <Loading />{" "}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col">
                  <span className="text-lg font-medium">
                    {data?.user?.name}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {data?.user?.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </SheetHeader>
        <Divider />
        <DropdownTheme />

        <Divider />

        <div className="space-y-2">
          <SheetClose asChild className="w-full">
            <ActiveLink
              isMobile
              href="/home/ranking"
              icon={<Trophy size={18} />}
              name="Ranking"
              setOpen={setOpen}
            />
          </SheetClose>

          <SheetClose asChild className="w-full">
            <ActiveLink
              isMobile
              href="/home/disciplines"
              icon={<Dumbbell size={18} />}
              name="Modalidades"
              setOpen={setOpen}
            />
          </SheetClose>

          <SheetClose asChild className="w-full">
            <ActiveLink
              isMobile
              href="/home/venues"
              icon={<MapPin size={18} />}
              name="Locais"
              setOpen={setOpen}
            />
          </SheetClose>

          <SheetClose asChild className="w-full">
            <ActiveLink
              isMobile
              href="/home/brazillian-athletes"
              icon={<User size={18} />}
              name="Atletas Brasileiros"
              setOpen={setOpen}
            />
          </SheetClose>

          <SheetClose asChild className="w-full">
            <ActiveLink
              isMobile
              setOpen={setOpen}
              icon={<Calendar size={18} />}
              href="/home/events"
              name="Eventos"
            />
          </SheetClose>
        </div>
        <Divider />

        <Button
          onClick={handleSignOut}
          className="w-full gap-2 rounded-lg font-bold"
          variant={"destructive"}
          size={"sm"}
        >
          <LogOut size={20} />
          <span>Sair</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
