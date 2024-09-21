package handler

import (
	"github.com/hellofresh/health-go/v5"
	"github.com/labstack/echo/v4"
	"github.com/thachawit/factify/infra"
)

type HealthConfig struct {
	App *infra.App
}

func NewHealthCheckHandler(healthConfig *HealthConfig) (echo.HandlerFunc, error) {

	health, err := health.New(health.WithComponent(health.Component{
		Name: healthConfig.App.Name,
	}))
	return echo.WrapHandler(health.Handler()), err
}
