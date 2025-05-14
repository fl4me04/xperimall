package controllers

import (
	"XperimallBackend/database"
	"XperimallBackend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetFloors(c *gin.Context) {
	var floors []models.Floor
	database.DB.Find(&floors)
	c.JSON(http.StatusOK, floors)
}

func GetActivitiesByFloor(c *gin.Context) {
	floorID := c.Param("floorId")
	var activities []models.Activity
	database.DB.Preload("Category").Preload("Floor").Where("floor_id = ?", floorID).Find(&activities)
	c.JSON(http.StatusOK, activities)
}
