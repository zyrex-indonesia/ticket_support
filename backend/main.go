package main

import (
	"log"
	"ticket_support/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Load routes
	routes.SetupRoutes(router)

	// Run server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
