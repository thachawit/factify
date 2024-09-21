package inbound

import (
	"context"

	"github.com/thachawit/factify/internal/core/model"
)

type WorldCoinInterface interface {
	VerifyProof(ctx context.Context, req *model.WorldCoinHandlerRequestVerfiy) (*model.WorldCoinHandlerResponse, error)
}
