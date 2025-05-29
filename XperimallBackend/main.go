package main

import (
	"fmt"
	"os"
	"time"

	"XperimallBackend/database"
	"XperimallBackend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin to release mode in production
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	database.ConnectDB()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetupRoutes(r)

	// Get PORT from env, default to 10000 for Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	fmt.Printf("🟢 Starting server on port: %s\n", port)

	// Bind to 0.0.0.0 to make it accessible from outside
	err := r.Run("0.0.0.0:" + port)
	if err != nil {
		fmt.Printf("🔴 Failed to start server: %v\n", err)
		os.Exit(1)
	}
}
