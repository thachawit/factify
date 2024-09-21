// app/[your-page]/page.tsx
"use client";

import React from "react";

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// app/[your-page]/page.tsx

// Optional: Add any other components, hooks, or libraries you need
// import YourComponent from "@/components/YourComponent";

const research_verify = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <h1 className="text-4xl font-bold text-white">Welcome to Your Page</h1>
      <p className="mt-4 text-lg text-gray-100 text-center">
        This is a sample page using the Next.js App Router structure.
      </p>

      {/* Add your page-specific content or components here */}
      {/* <YourComponent /> */}

      <button
        className="mt-6 px-4 py-2 bg-white text-purple-700 rounded shadow hover:bg-purple-200 transition"
        onClick={() => alert("Button clicked!")}
      >
        Click Me
      </button>
    </main>
  );
};

export default research_verify;
