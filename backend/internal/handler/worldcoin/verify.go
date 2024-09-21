package worldcoin

import (
	"github.com/go-playground/validator/v10"
	"github.com/thachawit/factify/internal/core/model"
	"github.com/thachawit/factify/internal/core/port/inbound"
)

type worldCoinHandler struct {
	validate         *validator.Validate
	worldCoinService inbound.WorldCoinInterface
}

func NewWorldCoinHandler(validate validator.Validate, worldCoinService inbound.WorldCoinInterface) *worldCoinHandler {
	return &worldCoinHandler{
		validate:         &validate,
		worldCoinService: worldCoinService,
	}
}

func (h *worldCoinHandler) VerifyProof(proofRequest model.WorldCoinHandlerRequest) (*model.WorldCoinHandlerResponse, error) {
	return &model.WorldCoinHandlerResponse{}, nil
}
