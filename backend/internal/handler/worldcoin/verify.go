package worldcoin

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/thachawit/factify/internal/core/model"
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
	var req model.WorldCoinHandlerRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadGateway, "Cannot bind struct")

	}

	if err := h.validate.Struct(&req); err != nil {
		return c.JSON(http.StatusOK, "the type of field is not correct")
	}

	verifyResult, err := h.worldCoinService.VerifyProof(c.Request().Context(), &req)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, verifyResult)
}
