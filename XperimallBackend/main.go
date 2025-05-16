package main

import (
  "fmt"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  port := os.Getenv("PORT")
  if port == "" {
    port = "8080"
  }
  fmt.Println("Starting server on port " + port)
  if err := r.Run("0.0.0.0:" + port); err != nil {
    fmt.Println("Failed to start server:", err)
  }
}
