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
	r := gin.Default()

	database.ConnectDB()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetupRoutes(r)

	// Port binding untuk Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🟢 Server starting on port: " + port)
	err := r.Run("0.0.0.0:" + port)
	if err != nil {
		fmt.Println("🔴 Failed to start server:", err)
	}
}
