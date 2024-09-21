"use client";

// for Next.js app router
import { useState } from "react";
import { IDKitWidget, ISuccessResult, VerificationLevel, VerificationResponse } from "@worldcoin/idkit";
import { Globe } from "lucide-react";

const WorldId = () => {
  const [isVerified, setIsVerified] = useState(false);

  // Callback when the modal is closed after successful verification
  const onSuccess = (result: ISuccessResult) => {
    console.log("Verification successful:", result);
    // Update state or perform any action upon successful verification
    setIsVerified(true);
  };

  // Callback when the proof is received
  const handleVerify = async (response: VerificationResponse) => {
    // Send the proof to your backend for verification
    try {
      const res = await fetch("http://0.0.0.0:1323/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Backend verification successful");
        return true; // Return true if verification succeeds
      } else {
        console.error("Backend verification failed");
        return false; // Return false if verification fails
      }
    } catch (error) {
      console.error("Error verifying on backend:", error);
      return false; // Return false if an error occurs
    }
  };

  return (
    <>
      {/* <IDKitWidget
        app_id="app_staging_c7268efb0452517eec8fe9c0289c234f"
        action="testing-action"
        onSuccess={onSuccess}
        handleVerify={handleVerify}
        verification_level={VerificationLevel.Orb}
        enableTelemetry={true}
      >
        {({ open }) => (
          <button
            onClick={open}
            className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-2xl group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100"></span>
            <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
            <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
            <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
            <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
            <span className="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
            <span className="relative flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Verify with World ID
            </span>
          </button>
        )}
      </IDKitWidget> */}
      <IDKitWidget
        app_id="app_staging_c7268efb0452517eec8fe9c0289c234f"
        action="test-prod"
        false
        verification_level={VerificationLevel.Device}
        handleVerify={handleVerify}
        onSuccess={onSuccess}
      >
        {({ open }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>
    </>
  );
};

export default WorldId;
