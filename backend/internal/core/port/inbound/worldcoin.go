package inbound

import "github.com/thachawit/factify/internal/core/model"

type WorldCoinInterface interface {
	VerifyProof(proofRequest model.WorldCoinHandlerRequest) (*model.WorldCoinHandlerResponse, error)
}
