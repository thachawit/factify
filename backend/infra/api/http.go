package api

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/go-resty/resty/v2"
	"github.com/labstack/echo/v4"
	"github.com/thachawit/factify/infra"
	"github.com/thachawit/factify/internal/adaptor"
	"github.com/thachawit/factify/internal/core/service"
	"github.com/thachawit/factify/internal/handler"
	"github.com/thachawit/factify/internal/handler/worldcoin"
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
	client := resty.New()
	validate := validator.New()
	healthHandler, err := handler.NewHealthCheckHandler(&handler.HealthConfig{
		App: &httpConfig.Config.App,
	})
	if err != nil {
		log.Panic("HealthCheck", err.Error())
	}

	app.GET("/health", healthHandler)

	worldCoinAdaptor := adaptor.NewWorldCoinAdaptor(*client)
	worldCoinService := service.NewWorldCoinService(worldCoinAdaptor)
	worldCoinHandler := worldcoin.NewWorldCoinHandler(validate, worldCoinService)

	app.POST("/verify-proof", worldCoinHandler.VerifyProof)
	return &HTTPServer{
		Echo:    app,
		configs: &httpConfig.Config.App,
	}
}
func (t *HTTPServer) Run(cleanupFns ...func()) {
	addr := ":" + t.configs.Port
	go func() {
		//Show Route
		for _, route := range t.Routes() {
			fmt.Println(route.Method + ":" + route.Path)
		}

		if err := t.Start(addr); err != nil && !errors.Is(err, http.ErrServerClosed) {
			t.Echo.Logger.Fatalf("shutting down the server %s", err.Error())
		}
	}()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Wait for interrupt signal to gracefully shutdown the server with a timeout of 10 seconds.
	<-ctx.Done()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := t.Echo.Shutdown(ctx); err != nil {
		log.Printf("error shutting down server %s\n", err.Error())
	} else {
		log.Println("Server gracefully stopped")
	}

	for _, fn := range cleanupFns {
		fn()
	}

	fmt.Println("Running cleanup tasks...")
}
