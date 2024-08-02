"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ReactNode } from "react";

interface ActiveLinkProps {
  href: string;
  name: string;
  icon: ReactNode;
  isMobile?: boolean;
  setOpen?: ((open: boolean) => void | undefined) | undefined;
}

const ActiveLink = ({
  href,
  name,
  icon,
  isMobile = false,
  setOpen,
}: ActiveLinkProps) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  const handleClick = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <div onClick={handleClick}>
      <Link href={href}>
        {isMobile ? (
          <div
            className={`w-full rounded-lg p-2 transition-colors hover:bg-accent ${
              isActive && "bg-accent"
            } `}
          >
            <div className="flex items-center gap-2">
              {icon} <span>{name}</span>
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center gap-3 rounded-md underline-offset-8 transition-opacity hover:underline ${
              isActive ? "underline" : "opacity-60 hover:opacity-100"
            }`}
          >
            {icon} <span>{name}</span>
          </div>
        )}
      </Link>
    </div>
  );
};
export default ActiveLink;
