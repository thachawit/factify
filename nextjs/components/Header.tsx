"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WorldId from "./WorldId";
import { Bars3Icon, BugAntIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className={`${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              } flex items-center px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
            >
              {icon && <span className="mr-2">{icon}</span>}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Factify
              </span>
            </Link>
            <Link href="/research_verify" className="flex items-center space-x-2 ml-4">
              <span className="text-l bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Research
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <WorldId />

            <div className="md:hidden">
              <button
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isDrawerOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${
          isDrawerOpen ? "block" : "hidden"
        } fixed inset-0 z-50 bg-background/80 backdrop-blur-sm`}
      >
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 shadow-lg" ref={burgerMenuRef}>
          <button
            className="absolute top-5 right-5 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsDrawerOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" />
          </button>
          <nav className="mt-8">
            <ul className="space-y-4">
              <HeaderMenuLinks />
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
