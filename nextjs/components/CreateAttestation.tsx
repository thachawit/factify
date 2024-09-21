"use client";

import { useState } from "react";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = "0xc44f89924070f06206a4c1465e87ea1551111be5fd8d6405a1978bb519356520";
const account = privateKeyToAccount(privateKey);

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
  const schemaId = "0x6d"; // Update with the actual schemaId

  const dataToAttest = {
    researcherID: data.researcherID,
    fullName: data.fullName,
    affiliation: data.affiliation,
    email: data.email,
    researchAreas: data.researchAreas,
    publicKey: data.publicKey,
    worldIDProof: data.worldIDProof,
  };

  try {
    const attestationParams = {
      schemaId: schemaId,
      data: dataToAttest,
      indexingValue: data.publicKey.toLowerCase(),
    };
    const res = await client.createAttestation(attestationParams);
    console.log("Attestation creation response:", res);
    alert("Attestation created successfully.");
  } catch (error) {
    console.error("Error during createAttestation:", error);
    alert("Error creating attestation. Check console for details.");
  }
}

const CreateAttestation = () => {
  const [researcherID, setResearcherID] = useState("");
  const [fullName, setFullName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState(account.address);
  const [worldIDProof, setWorldIDProof] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createResearcherAttestation({
      researcherID,
      fullName,
      affiliation,
      email,
      researchAreas,
      publicKey,
      worldIDProof,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-base-200 rounded-lg shadow-md">
      <div className="form-control">
        <label htmlFor="researcherID" className="label">
          <span className="label-text text-base-content">Researcher ID:</span>
        </label>
        <input
          type="text"
          id="researcherID"
          value={researcherID}
          onChange={e => setResearcherID(e.target.value)}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter Researcher ID"
        />
      </div>
      <div className="form-control">
        <label htmlFor="fullName" className="label">
          <span className="label-text text-base-content">Full Name:</span>
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter Full Name"
        />
      </div>
      <div className="form-control">
        <label htmlFor="affiliation" className="label">
          <span className="label-text text-base-content">Affiliation:</span>
        </label>
        <input
          type="text"
          id="affiliation"
          value={affiliation}
          onChange={e => setAffiliation(e.target.value)}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter Affiliation"
        />
      </div>
      <div className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text text-base-content">Email:</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter Email"
        />
      </div>
      <div className="form-control">
        <label htmlFor="researchAreas" className="label">
          <span className="label-text text-base-content">Research Areas (comma-separated):</span>
        </label>
        <input
          type="text"
          id="researchAreas"
          value={researchAreas.join(",")}
          onChange={e => setResearchAreas(e.target.value.split(",").map(s => s.trim()))}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter Research Areas"
        />
      </div>
      <div className="form-control">
        <label htmlFor="publicKey" className="label">
          <span className="label-text text-base-content">Public Key:</span>
        </label>
        <input
          type="text"
          id="publicKey"
          value={publicKey}
          onChange={e => setPublicKey(e.target.value)}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter Public Key"
        />
      </div>
      <div className="form-control">
        <label htmlFor="worldIDProof" className="label">
          <span className="label-text text-base-content">World ID Proof:</span>
        </label>
        <input
          type="text"
          id="worldIDProof"
          value={worldIDProof}
          onChange={e => setWorldIDProof(e.target.value)}
          className="input input-bordered input-primary w-full bg-base-100 text-base-content"
          placeholder="Enter World ID Proof"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-4">
        Submit
      </button>
    </form>
  );
};

export default CreateAttestation;
