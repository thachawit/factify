"use client";

import { useState } from "react";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import axios from "axios";
import { decodeAbiParameters } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = "0xc44f89924070f06206a4c1465e87ea1551111be5fd8d6405a1978bb519356520";

// Create an account using viem
const account = privateKeyToAccount(privateKey);
console.log("Account object:", account);
console.log("Account address:", account.address);

// Initialize the SignProtocolClient with the account
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.gnosisChiado,
  account: account,
});

async function createResearcherAttestation(data: {
  researcherID: string;
  fullName: string;
  affiliation: string;
  email: string;
  researchAreas: string[];
  publicKey: string;
  worldIDProof: string;
}) {
  // Replace with your actual schemaId after registering the schema
  const schemaId = "0x123"; // <-- Update this with the actual schemaId

  // Prepare data to attest
  const dataToAttest = {
    researcherID: data.researcherID,
    fullName: data.fullName,
    affiliation: data.affiliation,
    email: data.email,
    researchAreas: data.researchAreas,
    publicKey: data.publicKey,
    worldIDProof: data.worldIDProof,
  };

  console.log("Data to attest:", dataToAttest);

  // Check for undefined fields
  for (const [key, value] of Object.entries(dataToAttest)) {
    if (value === undefined || value === null) {
      console.error(`Data field "${key}" is undefined or null`);
    }
  }

  const attestationParams = {
    schemaId: schemaId,
    data: dataToAttest,
    indexingValue: data.publicKey.toLowerCase(),
  };

  console.log("Attestation parameters:", attestationParams);

  try {
    const res = await client.createAttestation(attestationParams);
    console.log("Attestation creation response:", res);
    alert("Attestation created successfully.");
  } catch (error) {
    console.error("Error during createAttestation:", error);
    throw error; // Re-throw the error to be caught in handleSubmit
  }
}

async function makeAttestationRequest(endpoint: string, options: any) {
  const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
  const res = await axios.request({
    url,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  if (res.status !== 200) {
    throw new Error(JSON.stringify(res));
  }
  return res.data;
}

async function queryAttestations(publicKey: string, schemaId: string) {
  const response = await makeAttestationRequest("index/attestations", {
    method: "GET",
    params: {
      mode: "onchain",
      schemaId: `onchain_evm_10200_${schemaId}`, // Adjust chain ID and schemaId accordingly
      attester: account.address,
      indexingValue: publicKey.toLowerCase(),
    },
  });

  if (!response.success) {
    return {
      success: false,
      message: response?.message ?? "Attestation query failed.",
    };
  }

  if (response.data?.total === 0) {
    return {
      success: false,
      message: "No attestation for this address found.",
    };
  }

  return {
    success: true,
    attestations: response.data.rows,
  };
}

function findAttestation(researcherID: string, attestations: any[], schemaData: any[]) {
  for (const att of attestations) {
    if (!att.data) continue;

    let parsedData: any = {};

    if (att.mode === "onchain") {
      try {
        // Adjusted parsing logic
        const schemaComponents = schemaData.map((item: any) => ({
          name: item.name,
          type: item.type,
        }));

        const data = decodeAbiParameters(schemaComponents, att.data);
        parsedData = {};
        schemaComponents.forEach((component: any, index: number) => {
          parsedData[component.name] = data[index];
        });
      } catch (error) {
        console.error("Error decoding on-chain data:", error);
        continue;
      }
    } else {
      try {
        parsedData = JSON.parse(att.data);
      } catch (error) {
        console.error("Error parsing off-chain data:", error);
        continue;
      }
    }

    if (parsedData?.researcherID === researcherID) {
      return { parsedData, attestation: att };
    }
  }

  return undefined;
}

const SignAttestation = () => {
  const [researcherID, setResearcherID] = useState("");
  const [fullName, setFullName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState(account.address);
  const [worldIDProof, setWorldIDProof] = useState("");
  const [attestations, setAttestations] = useState<any[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [showAttestations, setShowAttestations] = useState(false);

  // Replace with your actual schemaId after registering the schema
  const schemaId = "0x123"; // <-- Update this with the actual schemaId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting researcher data:", {
      researcherID,
      fullName,
      affiliation,
      email,
      researchAreas,
      publicKey,
      worldIDProof,
    });

    try {
      await createResearcherAttestation({
        researcherID,
        fullName,
        affiliation,
        email,
        researchAreas,
        publicKey,
        worldIDProof,
      });
    } catch (error) {
      console.error("Error creating attestation:", error);
      alert("Error creating attestation. Check console for details.");
    }
  };

  const handleQueryAttestations = async () => {
    const result = await queryAttestations(publicKey, schemaId);
    setQueryResult(result);
    if (result.success) {
      setAttestations(result.attestations);
      setShowAttestations(true);
      console.log(result.attestations);
    } else {
      alert(result.message);
    }
  };

  const handleFindAttestation = async () => {
    // Retrieve the schema to get schema data fields
    const schema = await client.getSchema(schemaId);
    console.log("Schema data fields:", JSON.stringify(schema.data, null, 2));

    const result = findAttestation(researcherID, attestations, schema.data);
    if (result) {
      console.log("Found attestation:", result);
      alert(`Found attestation: ${JSON.stringify(result.parsedData)}`);
    } else {
      console.log("No attestation found for the given Researcher ID.");
      alert("No attestation found for the given Researcher ID.");
    }
  };

  const AttestationCard = ({ attestation }: { attestation: any }) => {
    const data = attestation.data;
    return (
      <div className="attestation-card">
        <h3>Attestation</h3>
        <p>
          <strong>Researcher ID:</strong> {data.researcherID}
        </p>
        <p>
          <strong>Full Name:</strong> {data.fullName}
        </p>
        <p>
          <strong>Affiliation:</strong> {data.affiliation}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Research Areas:</strong> {data.researchAreas.join(", ")}
        </p>
        <p>
          <strong>Public Key:</strong> {data.publicKey}
        </p>
        <p>
          <strong>Schema ID:</strong> {attestation.schemaId}
        </p>
        <p>
          <strong>Indexing Value:</strong> {attestation.indexingValue}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="researcherID" className="text-white font-semibold">
            Researcher ID:
          </label>
          <input
            type="text"
            id="researcherID"
            value={researcherID}
            onChange={e => setResearcherID(e.target.value)}
            className="bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Researcher ID"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fullName" className="text-white font-semibold">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="bg-gradient-to-r from-teal-300 to-green-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter Full Name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="affiliation" className="text-white font-semibold">
            Affiliation:
          </label>
          <input
            type="text"
            id="affiliation"
            value={affiliation}
            onChange={e => setAffiliation(e.target.value)}
            className="bg-gradient-to-r from-blue-300 to-indigo-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Affiliation"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-white font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-gradient-to-r from-pink-300 to-red-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter Email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="researchAreas" className="text-white font-semibold">
            Research Areas (comma-separated):
          </label>
          <input
            type="text"
            id="researchAreas"
            value={researchAreas.join(",")}
            onChange={e => setResearchAreas(e.target.value.split(",").map(s => s.trim()))}
            className="bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Research Areas"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="publicKey" className="text-white font-semibold">
            Public Key:
          </label>
          <input
            type="text"
            id="publicKey"
            value={publicKey}
            onChange={e => setPublicKey(e.target.value)}
            className="bg-gradient-to-r from-teal-300 to-green-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter Public Key"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="worldIDProof" className="text-white font-semibold">
            World ID Proof:
          </label>
          <input
            type="text"
            id="worldIDProof"
            value={worldIDProof}
            onChange={e => setWorldIDProof(e.target.value)}
            className="bg-gradient-to-r from-blue-300 to-indigo-400 text-gray-900 placeholder-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter World ID Proof"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          Submit
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={handleQueryAttestations}
          className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Query Attestations
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={handleFindAttestation}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Find Attestation
        </button>
      </div>

      {queryResult && !queryResult.success && <p className="text-white mt-4">{queryResult.message}</p>}

      {showAttestations && (
        <div className="attestations-list mt-4">
          {attestations.map((attestation, index) => (
            <AttestationCard key={index} attestation={attestation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SignAttestation;
