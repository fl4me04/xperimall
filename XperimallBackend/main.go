package main

import (
	"log"
	"os"

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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🟢 Server starting on port %s", port)
	if err := r.Run("0.0.0.0:" + port); err != nil {
		log.Panicf("❌ Failed to start server: %s", err)
	}

}
