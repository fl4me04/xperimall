package controllers

import (
	"XperimallBackend/database"
	"XperimallBackend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTenantByID(c *gin.Context) {
	id := c.Param("id")
	var tenant models.Tenant

	result := database.DB.Table("new_tenants").First(&tenant, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Tenant not found",
		})
		return
	}

	c.JSON(http.StatusOK, tenant)
}
