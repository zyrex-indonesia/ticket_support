package routes

import (
	"ticket_support/config"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the API routes
func SetupRoutes(router *gin.Engine) {
	// Initialize the database
	config.InitDB()

	// Define routes
	router.POST("/login", Login)
	router.POST("/tickets", SubmitTicket)
	router.GET("/tickets", GetTickets)
}
