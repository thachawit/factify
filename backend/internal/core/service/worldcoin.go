package service

import (
	"context"

	model2 "github.com/thachawit/factify/internal/adaptor/model"
	"github.com/thachawit/factify/internal/core/model"
	"github.com/thachawit/factify/internal/core/port/inbound"
	"github.com/thachawit/factify/internal/core/port/outbound"
)

type worldCoinService struct {
	worldCoinAdaptor outbound.WorldCoinAdaptor
}

func NewWorldCoinService(worldCoinAdaptor outbound.WorldCoinAdaptor) inbound.WorldCoinInterface {
	return &worldCoinService{
		worldCoinAdaptor: worldCoinAdaptor,
	}
}

func (s *worldCoinService) VerifyProof(ctx context.Context, req *model.WorldCoinHandlerRequest) (*model.WorldCoinHandlerResponse, error) {
	res, err := s.worldCoinAdaptor.VerifyProof(ctx, model2.WorldCoinAdaptorRequest(*req))
	if err != nil {
		return nil, err
	}
	return (*model.WorldCoinHandlerResponse)(res), nil
}
