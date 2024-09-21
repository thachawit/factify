package api

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/thachawit/factify/infra"
	"github.com/thachawit/factify/internal/handler"
)

type HTTPServer struct {
	*echo.Echo
	configs *infra.App
}

type HTTPConfig struct {
	Config *infra.AppConfigs
}

func HTTPinit(httpConfig *HTTPConfig) *HTTPServer {
	app := echo.New()
	healthHandler, err := handler.NewHealthCheckHandler(&handler.HealthConfig{
		App: &httpConfig.Config.App,
	})
	if err != nil {
		log.Panic("HealthCheck", err.Error())
	}

	app.GET("/health", healthHandler)

	// validate := validator.New()

	return &HTTPServer{
		Echo:    app,
		configs: &httpConfig.Config.App,
	}
}
