package model

import "time"

type WorldCoinHandlerRequest struct {
	NullifierHash     string
	MerkleRoot        string
	VerificationLevel string
	Action            string
	SignalHash        string
}

type WorldCoinHandlerRequestVerfiy struct {
	AppID string `json:"appID"`
}

type WorldCoinHandlerResponse struct {
	VerifyProof   bool
	Action        string
	NullifierHash string
	CreatedAt     time.Time
}
