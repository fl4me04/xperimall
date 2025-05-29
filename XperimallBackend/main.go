package main

import (
	"fmt"
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

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Xperimall Backend is running",
		})
	})

	
	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🟢 Server starting on port: " + port)
	err := r.Run(":" + port)
	if err != nil {
		fmt.Println("🔴 Failed to start server:", err)
	}
}
