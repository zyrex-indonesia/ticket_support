package routes

import (
	"net/http"
	"ticket_support/models"
	"time"

	"github.com/gin-gonic/gin"
)

func SubmitTicket(c *gin.Context) {
	var ticket models.Ticket
	if err := c.BindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Auto-fill date and time
	ticket.Date = time.Now().Format("2006-01-02")
	ticket.Time = time.Now().Format("15:04:05")

	if err := models.CreateTicket(ticket); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit ticket"})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

func GetTickets(c *gin.Context) {
	tickets, err := models.GetAllTickets()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
		return
	}
	c.JSON(http.StatusOK, tickets)
}
