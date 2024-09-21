"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CreateIdAttestation from "~~/components/CreateIdAttestation";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
        {/* <SignAttestation /> */}
        <CreateIdAttestation />
      </div>
    </>
  );
};

export default Home;
