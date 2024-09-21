"use client";

import { useState } from "react";
import { IDKitWidget, ISuccessResult, VerificationLevel, VerificationResponse } from "@worldcoin/idkit";
import { Globe } from "lucide-react";

const WorldId = ({ onVerifySuccess }) => {
  const [isVerified, setIsVerified] = useState(false);

  // Callback when the modal is closed after successful verification
  const onSuccess = (result: ISuccessResult) => {
    console.log("Verification successful:", result);
    setIsVerified(true);
    onVerifySuccess(result); // Pass the result to the parent component
  };

  // Callback when the proof is received
  const handleVerify = async (response: VerificationResponse) => {
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
        return true;
      } else {
        console.error("Backend verification failed");
        return false;
      }
    } catch (error) {
      console.error("Error verifying on backend:", error);
      return false;
    }
  };

  return (
    <IDKitWidget
      app_id="app_staging_c7268efb0452517eec8fe9c0289c234f"
      action="test-prod"
      verification_level={VerificationLevel.Device}
      handleVerify={handleVerify}
      onSuccess={onSuccess}
    >
      {({ open }) => <button onClick={open}>Verify with World ID</button>}
    </IDKitWidget>
  );
};

export default WorldId;
