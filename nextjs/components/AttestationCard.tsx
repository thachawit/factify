const AttestationCard = ({ attestation }: { attestation: any }) => {
  // Safely access parsedData and attestation details
  const data = attestation?.parsedData || {};
  const attestationDetails = attestation?.attestation || {};

  // Safely format researchAreas
  const researchAreasDisplay = Array.isArray(data.researchAreas)
    ? data.researchAreas.map((area: string) => area.replace(/"/g, "")).join(", ")
    : "N/A";

  return (
    <div className="card bg-base-100 shadow-xl rounded-lg p-6">
      <div className="card-body">
        <h3 className="card-title text-primary">Attestation Details</h3>
        <div className="space-y-2">
          <p className="text-base-content">
            <span className="font-bold text-secondary">Researcher ID:</span> {data.researcherID || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Full Name:</span> {data.fullName || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Affiliation:</span> {data.affiliation || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Email:</span> {data.email || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Research Areas:</span> {researchAreasDisplay}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Public Key:</span> {data.publicKey || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">World ID Proof:</span>{" "}
            <span className="break-all">{data.worldIDProof || "N/A"}</span>
          </p>
        </div>
        <h4 className="text-lg font-semibold text-primary mt-4">Attestation Metadata</h4>
        <div className="space-y-2">
          <p className="text-base-content">
            <span className="font-bold text-secondary">Attestation ID:</span>{" "}
            {attestationDetails.attestationId || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Transaction Hash:</span>{" "}
            <span className="break-all">{attestationDetails.transactionHash || "N/A"}</span>
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Chain Type:</span> {attestationDetails.chainType || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Chain ID:</span> {attestationDetails.chainId || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Schema ID:</span> {attestationDetails.schemaId || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Indexing Value:</span>{" "}
            {attestationDetails.indexingValue || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Attester:</span> {attestationDetails.attester || "N/A"}
          </p>
          <p className="text-base-content">
            <span className="font-bold text-secondary">Attestation Timestamp:</span>{" "}
            {attestationDetails.attestTimestamp
              ? new Date(parseInt(attestationDetails.attestTimestamp)).toLocaleString()
              : "N/A"}
          </p>
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-primary">View More</button>
        </div>
      </div>
    </div>
  );
};

export default AttestationCard;
