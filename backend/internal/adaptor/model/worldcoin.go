package model

import "time"

type WorldCoinAdaptorRequest struct {
	AppID             string
	NullifierHash     string
	MerkleRoot        string
	VerificationLevel string
	Action            string
	SignalHash        string
}
type WorldCoinAdaptorResponse struct {
	VerifyProof   bool
	Action        string
	NullifierHash string
	CreatedAt     time.Time
}
