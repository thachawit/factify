package model

import "time"

type WorldCoinAdaptorRequest struct {
	NullifierHash     string
	MerkleRoot        string
	VerificationLevel string
	Action            string
	SignalHash        string
}

type WorldCoinAdaptorRequestVerify struct {
	AppID string
}
type WorldCoinAdaptorResponse struct {
	VerifyProof   bool
	Action        string
	NullifierHash string
	CreatedAt     time.Time
}
