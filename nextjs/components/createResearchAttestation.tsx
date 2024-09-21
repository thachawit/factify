"use client";

import { useEffect, useState } from "react";
import WorldId from "./WorldId";
// Import World ID component for authentication
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

// Replace with your private key
const privateKey = "0xc44f89924070f06206a4c1465e87ea1551111be5fd8d6405a1978bb519356520";
const account = privateKeyToAccount(privateKey);

// Initialize the SignProtocolClient with the account
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.gnosisChiado,
  account: account,
});

async function createResearchAttestation(data: {
  researchID: string;
  biasScoring: string;
  signatureID: string;
  datetime: string;
  base64ResearchUpload: string;
}) {
  const schemaId = "0x77"; // Update with the actual schema ID

  const dataToAttest = {
    researchID: data.researchID,
    biasScoring: data.biasScoring,
    signatureID: data.signatureID,
    datetime: data.datetime,
    base64ResearchUpload: data.base64ResearchUpload,
  };

  try {
    const attestationParams = {
      schemaId: schemaId,
      data: dataToAttest,
      indexingValue: data.signatureID.toLowerCase(),
    };
    const res = await client.createAttestation(attestationParams);
    console.log("Attestation creation response:", res);
    alert("Research attestation created successfully.");
  } catch (error) {
    console.error("Error during createAttestation:", error);
    alert("Error creating attestation. Check console for details.");
  }
}

const CreateResearchAtt = () => {
  const [researchID, setResearchID] = useState("");
  const [biasScoring, setBiasScoring] = useState("");
  const [signatureID, setSignatureID] = useState(account.address);
  const [datetime, setDatetime] = useState(new Date().toISOString());
  const [base64ResearchUpload, setBase64ResearchUpload] = useState("");
  const [isVerified, setIsVerified] = useState(false); // State to track if World ID authentication is successful

  // Automatically generate a research ID and set the current time
  useEffect(() => {
    const generateResearchID = () => {
      const uniqueID = `RES-${Date.now()}`; // Prefix with "RES-" and current timestamp
      setResearchID(uniqueID);
    };

    const updateDateTime = () => {
      setDatetime(new Date().toISOString());
    };

    generateResearchID();
    updateDateTime();
  }, []);

  // Function to handle file upload and convert to Base64
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setBase64ResearchUpload(base64);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        alert("Failed to encode file. Please try another file.");
      }
    }
  };

  // Helper function to convert file to Base64 format
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please authenticate with World ID before submitting.");
      return;
    }
    await createResearchAttestation({
      researchID,
      biasScoring,
      signatureID,
      datetime,
      base64ResearchUpload,
    });
  };

  // Callback to handle successful verification from World ID
  const handleVerificationSuccess = () => {
    setIsVerified(true); // Set verification state to true when successful
  };

  return (
    <div className="space-y-6">
      {/* World ID Component for Verification */}
      <WorldId onVerifySuccess={handleVerificationSuccess} />

      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-base-200 rounded-lg shadow-md">
        <div className="form-control">
          <label htmlFor="researchID" className="label">
            <span className="label-text text-base-content">Research ID:</span>
          </label>
          <input
            type="text"
            id="researchID"
            value={researchID}
            readOnly // Make the field read-only since it's auto-generated
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          />
        </div>
        <div className="form-control">
          <label htmlFor="biasScoring" className="label">
            <span className="label-text text-base-content">Bias Scoring:</span>
          </label>
          <input
            type="text"
            id="biasScoring"
            value={biasScoring}
            onChange={e => setBiasScoring(e.target.value)}
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
            placeholder="Enter Bias Scoring"
          />
        </div>
        <div className="form-control">
          <label htmlFor="signatureID" className="label">
            <span className="label-text text-base-content">Signature ID:</span>
          </label>
          <input
            type="text"
            id="signatureID"
            value={signatureID}
            onChange={e => setSignatureID(e.target.value)}
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
            placeholder="Enter Signature ID"
          />
        </div>
        <div className="form-control">
          <label htmlFor="datetime" className="label">
            <span className="label-text text-base-content">Date and Time:</span>
          </label>
          <input
            type="datetime-local"
            id="datetime"
            value={datetime.slice(0, 16)} // Format to "YYYY-MM-DDTHH:MM"
            readOnly // Make the field read-only since it's auto-updated
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          />
        </div>
        <div className="form-control">
          <label htmlFor="base64ResearchUpload" className="label">
            <span className="label-text text-base-content">Research File (Base64):</span>
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary w-full mt-4 ${isVerified ? "" : "opacity-50 cursor-not-allowed"}`}
          disabled={!isVerified}
        >
          {isVerified ? "Submit Attestation" : "Authenticate to Enable Submission"}
        </button>
      </form>
    </div>
  );
};

export default CreateResearchAtt;
