package worldcoin

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/thachawit/factify/internal/core/port/inbound"
)

type worldCoinHandler struct {
	validate         *validator.Validate
	worldCoinService inbound.WorldCoinInterface
}

func NewWorldCoinHandler(validate *validator.Validate, worldCoinService inbound.WorldCoinInterface) *worldCoinHandler {
	return &worldCoinHandler{
		validate:         validate,
		worldCoinService: worldCoinService,
	}
}

func (h *worldCoinHandler) VerifyProof(c echo.Context) error {
	return c.JSON(http.StatusOK, "")
}
