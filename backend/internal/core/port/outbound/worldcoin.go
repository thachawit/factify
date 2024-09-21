package outbound

import (
	model2 "github.com/thachawit/factify/internal/adaptor/model"
)

type WorldCoinAdaptor interface {
	VerifyProof(proofModel model2.WorldCoinAdaptorRequest) (*model2.WorldCoinAdaptorResponse, error)
}
