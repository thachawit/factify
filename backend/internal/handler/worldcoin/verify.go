package worldcoin

import (
	"github.com/go-playground/validator/v10"
	"github.com/thachawit/factify/internal/core/model"
	"github.com/thachawit/factify/internal/core/port/inbound"
)

func NewWorldCoinHandler() {

}

type WorldCoinHandler struct {
	validate         *validator.Validate
	worldCoinService inbound.WorldCoinInterface
}

func (h *WorldCoinHandler) VerifyProof(proofRequest model.WorldCoinHandlerRequest) (*model.WorldCoinHandlerResponse, error) {
	return &model.WorldCoinHandlerResponse{}, nil
}
