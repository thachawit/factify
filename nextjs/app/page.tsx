"use client";

import type { NextPage } from "next";
import CreateAttestation from "~~/components/CreateAttestation";
import QueryAttestation from "~~/components/QueryAttestation";

/* --- Begin nextjs/app/page.tsx --- */

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Attestation Dashboard</h1>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Create Attestation Section */}
        <div className="flex-1 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Attestation</h2>
          <CreateAttestation />
        </div>

        {/* Query Attestation Section */}
        <div className="flex-1 bg-gradient-to-br from-teal-400 to-green-500 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Query Attestation</h2>
          <QueryAttestation />
        </div>
      </div>
    </div>
  );
};

export default Home;
