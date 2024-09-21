"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SignAttestation from "~~/components/SignAttestation";
import WorldId from "~~/components/WorldId";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
        <SignAttestation />
      </div>
    </>
  );
};

export default Home;
