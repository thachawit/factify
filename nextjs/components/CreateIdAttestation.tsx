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
  const schemaId = "0x6d"; // <-- Update this with the actual schemaId

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
      //   indexingValue: publicKey.toLowerCase(),
      indexingValue: "0x1234567890abcdef1234567890abcdef12345678",
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

const CreateIdAttestation = () => {
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
  const [searchResearcherID, setSearchResearcherID] = useState(""); // State for search input
  const [foundAttestation, setFoundAttestation] = useState<any>(null); // State to hold found attestation

  // Replace with your actual schemaId after registering the schema
  const schemaId = "0x6d"; // <-- Update this with the actual schemaId

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

  const handleFindAttestation = async (e: React.FormEvent) => {
    e.preventDefault();
    // Retrieve the schema to get schema data fields
    const schema = await client.getSchema(schemaId);
    console.log("Schema data fields:", JSON.stringify(schema.data, null, 2));

    const result = findAttestation(searchResearcherID, attestations, schema.data);
    if (result) {
      console.log("Found attestation:", result);
      setFoundAttestation(result);
      alert(`Found attestation: ${JSON.stringify(result.parsedData)}`);
    } else {
      console.log("No attestation found for the given Researcher ID.");
      alert("No attestation found for the given Researcher ID.");
    }
  };

  const AttestationCard = ({ attestation }: { attestation: any }) => {
    const data = attestation.data;

    // Ensure researchAreas is an array before calling join
    const researchAreasDisplay = Array.isArray(data.researchAreas) ? data.researchAreas.join(", ") : "N/A";

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
          <strong>Research Areas:</strong> {researchAreasDisplay}
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="researcherID">Researcher ID:</label>
          <input type="text" id="researcherID" value={researcherID} onChange={e => setResearcherID(e.target.value)} />
        </div>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="affiliation">Affiliation:</label>
          <input type="text" id="affiliation" value={affiliation} onChange={e => setAffiliation(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="researchAreas">Research Areas (comma-separated):</label>
          <input
            type="text"
            id="researchAreas"
            value={researchAreas.join(",")}
            onChange={e => setResearchAreas(e.target.value.split(",").map(s => s.trim()))}
          />
        </div>
        <div>
          <label htmlFor="publicKey">Public Key:</label>
          <input type="text" id="publicKey" value={publicKey} onChange={e => setPublicKey(e.target.value)} />
        </div>
        <div>
          <label htmlFor="worldIDProof">World ID Proof:</label>
          <input type="text" id="worldIDProof" value={worldIDProof} onChange={e => setWorldIDProof(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <button onClick={handleQueryAttestations}>Query Attestations</button>
      </div>

      {/* Form to search for a specific attestation by Researcher ID */}
      <form onSubmit={handleFindAttestation}>
        <div>
          <label htmlFor="searchResearcherID">Search Researcher ID:</label>
          <input
            type="text"
            id="searchResearcherID"
            value={searchResearcherID}
            onChange={e => setSearchResearcherID(e.target.value)}
          />
        </div>
        <button type="submit">Find Attestation</button>
      </form>

      {queryResult && !queryResult.success && <p>{queryResult.message}</p>}

      {showAttestations && (
        <div className="attestations-list">
          {attestations.map((attestation, index) => (
            <AttestationCard key={index} attestation={attestation} />
          ))}
        </div>
      )}

      {foundAttestation && (
        <div className="found-attestation">
          <h3>Found Attestation</h3>
          <AttestationCard attestation={foundAttestation.attestation} />
        </div>
      )}
    </div>
  );
};

export default CreateIdAttestation;
