package outbound

import (
	"context"

	model2 "github.com/thachawit/factify/internal/adaptor/model"
)

type WorldCoinAdaptor interface {
	VerifyProof(ctx context.Context, proofModel model2.WorldCoinAdaptorRequest) (*model2.WorldCoinAdaptorResponse, error)
}
