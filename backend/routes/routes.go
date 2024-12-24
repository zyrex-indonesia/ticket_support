package routes

import (
	"ticket_support/config"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the API routes.
func SetupRoutes(router *gin.Engine) {
	// Initialize the database
	config.InitDB()

	// Public routes
	router.POST("/tickets", SubmitTicketHandler)

	// Admin routes
	router.PUT("/tickets/status", UpdateTicketStatusHandler)
	router.GET("/tickets", GetTicketsHandler) // Fetch all tickets (admin)
}
