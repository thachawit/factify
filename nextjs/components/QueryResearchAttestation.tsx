"use client";

import { useState } from "react";
import AttestationCard from "./AttestationCard";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import axios from "axios";
import { decodeAbiParameters } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Setup private key and account
const privateKey = "0xc44f89924070f06206a4c1465e87ea1551111be5fd8d6405a1978bb519356520";
const account = privateKeyToAccount(privateKey);

// Initialize the SignProtocolClient with the account
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.gnosisChiado,
  account: account,
});

// Function to make requests to the backend
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

// Function to query attestations
async function queryAttestations(indexingValue: string, schemaId: string) {
  const response = await makeAttestationRequest("index/attestations", {
    method: "GET",
    params: {
      mode: "onchain",
      schemaId: `onchain_evm_10200_${schemaId}`,
      attester: account.address,
      indexingValue: indexingValue.toLowerCase(),
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

// Function to find attestation
function findAttestation(researchID: string, attestations: any[], schemaData: any[]) {
  for (const att of attestations) {
    if (!att.data) continue;

    let parsedData: any = {};

    if (att.mode === "onchain") {
      try {
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

    if (parsedData?.researchID === researchID) {
      return { parsedData, attestation: att };
    }
  }

  return undefined;
}

const QueryResearchAttestation = () => {
  const [attestations, setAttestations] = useState<any[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [showAttestations, setShowAttestations] = useState(false);
  const [searchResearchID, setSearchResearchID] = useState("");
  const [foundAttestation, setFoundAttestation] = useState<any>(null);
  const [indexingValue, setIndexingValue] = useState(""); // New state for indexingValue input
  const schemaId = "0x77"; // Update with the actual schemaId

  // Handle querying of attestations
  const handleQueryAttestations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indexingValue) {
      alert("Please enter an indexing value.");
      return;
    }
    const result = await queryAttestations(indexingValue, schemaId);
    setQueryResult(result);
    if (result.success) {
      setAttestations(result.attestations);
      setShowAttestations(true);
      console.log(result.attestations);
    } else {
      alert(result.message);
    }
  };

  // Handle finding a specific attestation
  const handleFindAttestation = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = await client.getSchema(schemaId);
    const result = findAttestation(searchResearchID, attestations, Array.isArray(schema.data) ? schema.data : []);
    if (result) {
      setFoundAttestation(result);
      alert(`Found attestation: ${JSON.stringify(result.parsedData)}`);
    } else {
      alert("No attestation found for the given Research ID.");
    }
  };

  return (
    <div>
      <form onSubmit={handleQueryAttestations} className="space-y-4 p-4 bg-base-200 rounded-lg shadow-md">
        <div className="form-control">
          <label htmlFor="indexingValue" className="label">
            <span className="label-text text-base-content">Indexing Value:</span>
          </label>
          <input
            type="text"
            id="indexingValue"
            value={indexingValue}
            onChange={e => setIndexingValue(e.target.value)}
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
            placeholder="Enter Indexing Value"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Query Attestations
        </button>
      </form>

      <form onSubmit={handleFindAttestation} className="space-y-4 p-4 bg-base-200 rounded-lg shadow-md mt-4">
        <div className="form-control">
          <label htmlFor="searchResearchID" className="label">
            <span className="label-text text-base-content">Search Research ID:</span>
          </label>
          <input
            type="text"
            id="searchResearchID"
            value={searchResearchID}
            onChange={e => setSearchResearchID(e.target.value)}
            className="input input-bordered input-primary w-full bg-base-100 text-base-content"
            placeholder="Enter Research ID"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Find Attestation
        </button>
      </form>

      {queryResult && !queryResult.success && <p>{queryResult.message}</p>}

      {showAttestations && (
        <div className="attestations-list">
          {attestations.map((attestation, index) => (
            <AttestationCard key={index} attestation={{ parsedData: attestation.data, attestation }} />
          ))}
        </div>
      )}

      {foundAttestation && (
        <div className="found-attestation">
          <h3>Found Attestation</h3>
          <AttestationCard attestation={foundAttestation} />
        </div>
      )}
    </div>
  );
};

export default QueryResearchAttestation;
