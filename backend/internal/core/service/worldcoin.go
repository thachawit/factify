package service

import (
	"context"

	"github.com/thachawit/factify/internal/core/model"
	"github.com/thachawit/factify/internal/core/port/outbound"
)

type worldCoinService struct {
	worldCoinAdaptor outbound.WorldCoinAdaptor
}

func NewWorldCoinService(ctx context.Context, req model.WorldCoinHandlerRequest) (*model.WorldCoinHandlerResponse, error) {

	return nil, nil
}
