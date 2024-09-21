package adaptor

import (
	"github.com/go-resty/resty/v2"
	"github.com/thachawit/factify/internal/adaptor/model"
	"github.com/thachawit/factify/internal/core/port/outbound"
)

type WorldCoinAdaptor struct {
	client resty.Client
}

func NewWorldCoinAdaptor(client resty.Client) outbound.WorldCoinAdaptor {
	return &WorldCoinAdaptor{
		client: client,
	}
}

func (a *WorldCoinAdaptor) VerifyProof(proofModel model.WorldCoinAdaptorRequest) (*model.WorldCoinAdaptorResponse, error) {
	return nil, nil
}
