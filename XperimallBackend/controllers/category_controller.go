package controllers

import (
	"XperimallBackend/database"
	"XperimallBackend/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /categories
func GetCategories(c *gin.Context) {
	var categories []models.Category
	database.DB.Preload("Activities").Find(&categories)
	c.JSON(http.StatusOK, categories)
}

// POST /recommendations
func GetRecommendations(c *gin.Context) {
	type Req struct {
		CategoryIDs []uint `json:"category_ids"`
		Budget      int    `json:"budget"`
	}
	var req Req
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Received request: %+v", req)

	var activities []models.Activity
	result := database.DB.Where("category_id IN ? AND price_min <= ?", req.CategoryIDs, req.Budget).Find(&activities)

	if result.Error != nil {
		log.Printf("Database error: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	log.Printf("Found %d activities", len(activities))
	c.JSON(http.StatusOK, activities)
}
