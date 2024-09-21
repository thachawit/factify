"use client";

import { useState } from "react";
import WorldId from "./WorldId";

// Import World ID component

type AuthBeforeCreateProps = {
  onSubmit: () => void; // Function to handle the form submission
};

const AuthBeforeCreate = ({ onSubmit }: AuthBeforeCreateProps) => {
  const [isVerified, setIsVerified] = useState(false); // State to track verification

  // Callback to handle verification success from World ID
  const handleVerificationSuccess = (result: { proof: string }) => {
    setIsVerified(true); // Set verification state to true when World ID proof is successful
  };

  return (
    <div className="space-y-4">
      {/* World ID Component for authentication */}
      <WorldId onVerifySuccess={handleVerificationSuccess} />

      {/* Submit button that is disabled until World ID verification is successful */}
      <button
        onClick={onSubmit}
        disabled={!isVerified}
        className={`btn btn-primary w-full ${isVerified ? "" : "opacity-50 cursor-not-allowed"}`}
      >
        {isVerified ? "Submit Attestation" : "Authenticate to Enable Submission"}
      </button>
    </div>
  );
};

export default AuthBeforeCreate;
