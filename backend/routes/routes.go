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

	// Login route
	router.POST("/login", Login) // Add this line to handle the login route

	// Admin routes
	router.PUT("/tickets/status", UpdateTicketStatus)
	router.GET("/tickets", GetTicketsHandler) // Fetch all tickets (admin)
}
