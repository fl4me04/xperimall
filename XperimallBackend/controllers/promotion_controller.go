package controllers

import (
	"XperimallBackend/database"
	"XperimallBackend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPromotionByID(c *gin.Context) {
	id := c.Param("id")
	var promotion models.Promotion

	result := database.DB.Table("promotions").First(&promotion, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Promotion not found",
		})
		return
	}

	c.JSON(http.StatusOK, promotion)
}
