"use client";

import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";

interface WorldIdProps {
  onVerifySuccess: (result: ISuccessResult) => void;
}

const WorldId = ({ onVerifySuccess }: WorldIdProps) => {
  // Callback when the modal is closed after successful verification
  const onSuccess = (result: ISuccessResult) => {
    console.log("Verification successful:", result);
    onVerifySuccess(result); // Pass the result to the parent component
  };

  // Callback when the proof is received
  const handleVerify = async (response: any): Promise<void> => {
    try {
      const res = await fetch("https://1f1d-223-255-254-102.ngrok-free.app/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Backend verification successful");
      } else {
        console.error("Backend verification failed");
      }
    } catch (error) {
      console.error("Error verifying on backend:", error);
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
