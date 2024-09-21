// app/[your-page]/page.tsx
"use client";

import React from "react";
import QueryResearchAttestation from "~~/components/QueryResearchAttestation";
import CreateIdAttestation from "~~/components/createResearchAttestation";

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// Optional: Add any other components, hooks, or libraries you need
// import YourComponent from "@/components/YourComponent";

const research_verify = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Attestation Dashboard</h1>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Create Research Attestation Section */}
        <div className="flex-1 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Research Attestation</h2>
          <CreateIdAttestation />
        </div>

        {/* Query Research Attestation Section */}
        <div className="flex-1 bg-gradient-to-br from-teal-400 to-green-500 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Query Research Attestation</h2>
          <QueryResearchAttestation />
        </div>
      </div>
    </div>
  );
};

export default research_verify;
