package controllers

import (
	"XperimallBackend/database"
	"XperimallBackend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetActivities(c *gin.Context) {
	var activities []models.Activity
	database.DB.Find(&activities)
	c.JSON(http.StatusOK, activities)
}
