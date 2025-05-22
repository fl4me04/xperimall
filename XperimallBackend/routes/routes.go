package routes

import (
	"XperimallBackend/controllers"
	"XperimallBackend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	auth := r.Group("/authentication")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.GET("/user", middlewares.AuthMiddleware(), controllers.GetUserDetails)
	}

	api := r.Group("/api")
	{
		api.GET("/categories", controllers.GetCategories)
		api.POST("/recommendations", controllers.GetRecommendations)
		api.GET("/activities", controllers.GetActivities)
		api.GET("/floors", controllers.GetFloors)
		api.GET("/floors/:floorId/activities", controllers.GetActivitiesByFloor)
	}
}
