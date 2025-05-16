package main

import (
	"XperimallBackend/database"
	"XperimallBackend/routes"

	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	database.ConnectDB()

	r.Use(cors.Default())

	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
