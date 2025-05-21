package main

import (
	"XperimallBackend/database"
	"XperimallBackend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    database.ConnectDB()

    r.Use(cors.Default())

    routes.SetupRoutes(r)

    r.Run(":8080")
}
