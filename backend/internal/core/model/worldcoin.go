package model

import "time"

type WorldCoinHandlerRequest struct {
	AppID             string `json:"appID"`
	NullifierHash     string
	MerkleRoot        string
	VerificationLevel string
	Action            string
	SignalHash        string
}
type WorldCoinHandlerResponse struct {
	VerifyProof   bool
	Action        string
	NullifierHash string
	CreatedAt     time.Time
}
