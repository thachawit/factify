package outbound

import (
	"context"

	"github.com/thachawit/factify/internal/adaptor/model"
)

type WorldCoinAdaptor interface {
	VerifyProof(ctx context.Context, proofModel model.WorldCoinAdaptorRequest) (*model.WorldCoinAdaptorResponse, error)
}
