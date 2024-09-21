"use client";

import { useState } from "react";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import axios from "axios";
import { decodeAbiParameters, isAddress } from "viem";
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

async function createNotaryAttestation(contractDetails: string, signerAddress: string) {
  if (!isAddress(signerAddress)) {
    throw new Error(`Invalid signer address: ${signerAddress}`);
  }

  console.log("Creating attestation with signer:", signerAddress);
  console.log("Contract details:", contractDetails);

  // Retrieve and log the schema to see what fields are expected
  const schema = await client.getSchema("0x4e");
  console.log("Schema data fields:", JSON.stringify(schema.data, null, 2));

  // Prepare data to attest
  const dataToAttest = {
    contractDetails,
    singer: signerAddress,
    // Include any additional required fields based on the schema
    attester: account.address, // Assuming 'attester' is required
  };

  console.log("Data to attest:", dataToAttest);

  // Check for undefined fields
  for (const [key, value] of Object.entries(dataToAttest)) {
    if (value === undefined || value === null) {
      console.error(`Data field "${key}" is undefined or null`);
    }
  }

  const attestationParams = {
    schemaId: "0x4e",
    data: dataToAttest,
    indexingValue: signerAddress.toLowerCase(),
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

async function queryAttestations() {
  const response = await makeAttestationRequest("index/attestations", {
    method: "GET",
    params: {
      mode: "onchain",
      schemaId: "onchain_evm_11155111_0x242",
      attester: "0x98c75B19737a03b935A61826ed1B2a03094Eee59",
      indexingValue: "0x06A60f734Fa2B43bDda4306A20036729749F5109".toLowerCase(),
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

function findAttestation(message: string, attestations: any[]) {
  for (const att of attestations) {
    if (!att.data) continue;

    let parsedData: any = {};

    if (att.mode === "onchain") {
      try {
        // Adjusted parsing logic
        const schemaComponents = att.schema.data.map((item: any) => ({
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

    if (parsedData?.contractDetails === message) {
      return { parsedData, attestation: att };
    }
  }

  return undefined;
}

const SignAttestation = () => {
  const [contractDetails, setContractDetails] = useState("");
  const [signerAddress, setSignerAddress] = useState("");
  const [attestations, setAttestations] = useState<any[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [showAttestations, setShowAttestations] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting contract details:", contractDetails);
    console.log("Submitting signer address:", signerAddress);

    if (!isAddress(signerAddress)) {
      alert("Please enter a valid signer address.");
      return;
    }

    try {
      await createNotaryAttestation(contractDetails, signerAddress);
    } catch (error) {
      console.error("Error creating attestation:", error);
      alert("Error creating attestation. Check console for details.");
    }
  };

  const handleQueryAttestations = async () => {
    const result = await queryAttestations();
    setQueryResult(result);
    if (result.success) {
      setAttestations(result.attestations);
      setShowAttestations(true);
      console.log(result.attestations);
    } else {
      alert(result.message);
    }
  };

  const handleFindAttestation = () => {
    const result = findAttestation(contractDetails, attestations);
    if (result) {
      console.log("Found attestation:", result);
      alert(`Found attestation: ${JSON.stringify(result.parsedData)}`);
    } else {
      console.log("No attestation found for the given contract details.");
      alert("No attestation found for the given contract details.");
    }
  };

  const AttestationCard = ({ attestation }: { attestation: any }) => {
    return (
      <div className="attestation-card">
        <h3>Attestation</h3>
        <p>
          <strong>Contract Details:</strong> {attestation.data.contractDetails}
        </p>
        <p>
          <strong>Signer:</strong> {attestation.data.signer}
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
          <label htmlFor="contractDetails">Contract Details:</label>
          <input
            type="text"
            id="contractDetails"
            value={contractDetails}
            onChange={e => setContractDetails(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signerAddress">Signer Address:</label>
          <input
            type="text"
            id="signerAddress"
            value={signerAddress}
            onChange={e => setSignerAddress(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <button onClick={handleQueryAttestations}>Query Attestations</button>
      </div>
      <div>
        <button onClick={handleFindAttestation}>Find Attestation</button>
      </div>

      {queryResult && !queryResult.success && <p>{queryResult.message}</p>}

      {showAttestations && (
        <div className="attestations-list">
          {attestations.map((attestation, index) => (
            <AttestationCard key={index} attestation={attestation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SignAttestation;
