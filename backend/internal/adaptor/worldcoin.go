package adaptor

import (
	"context"
	"errors"
	"fmt"

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

func (a *WorldCoinAdaptor) VerifyProof(ctx context.Context, proofModel model.WorldCoinAdaptorRequest) (*model.WorldCoinAdaptorResponse, error) {
	appID := "{app_id}" // Replace with the actual app ID
	url := fmt.Sprintf("http://your-api-url/api/v2/verify/%s", appID)

	payload := &model.WorldCoinAdaptorRequest{
		NullifierHash:     proofModel.NullifierHash,
		MerkleRoot:        proofModel.MerkleRoot,
		VerificationLevel: proofModel.VerificationLevel,
		Action:            proofModel.Action,
		SignalHash:        proofModel.SignalHash,
	}
	result := model.WorldCoinAdaptorResponse{}
	resp, err := a.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(payload).
		SetResult(&result).
		Post(url)

	// Check for errors
	if err != nil {
		return nil, err
	}
	if resp.IsError() {
		return nil, errors.New(resp.Status())
	}

	return &result, nil
}
