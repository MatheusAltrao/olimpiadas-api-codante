"use client";
import Link from "next/link";
import ActiveLink from "./activeLink";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 pt-10">
      <Link href={"/"} className="text-lg font-bold">
        Olimpíadas Paris 2024
      </Link>

      <nav className="hidden items-center gap-3 text-sm lg:flex">
        <ActiveLink href="/home/ranking" icon="" name="Ranking" />
        <ActiveLink href="/home/disciplines" icon="" name="Modalidades" />
        <ActiveLink href="/home/venues" icon="" name="Locais" />
        <ActiveLink
          href="/home/brazillian-athletes"
          icon=""
          name="Atletas Brasileiros"
        />
        <ActiveLink href="/home/events" icon="" name="Eventos" />
      </nav>

      <Menu />
    </header>
  );
};

export default Header;
