package main

import (
	"github.com/thachawit/factify/infra"
	"github.com/thachawit/factify/infra/api"
)

func main() {
	config := infra.AppConfigs{
		App: infra.App{
			Name: "worldcoin",
			Port: "1323",
		},
	}
	app := api.HTTPinit(&api.HTTPConfig{
		Config: &config,
	})

	app.Run()

}
