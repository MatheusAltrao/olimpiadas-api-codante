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
  Dumbbell,
  LogOut,
  MapPin,
  Menu as MenuICon,
  Trophy,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ActiveLink from "./activeLink";

const Menu = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="lg:hidden" size={"icon"} variant={"outline"}>
          <MenuICon size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-8">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Aqui estão todas as nossas rotas disponíveis.
          </SheetDescription>
        </SheetHeader>

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
        </div>

        <Button
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
