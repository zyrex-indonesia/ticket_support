package routes

import (
	"net/http"
	"ticket_support/models"
	"time"

	"github.com/gin-gonic/gin"
)

func GetTicketsHandler(c *gin.Context) {
	tickets, err := models.GetAllTickets()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
		return
	}
	c.JSON(http.StatusOK, tickets)
}

func SubmitTicketHandler(c *gin.Context) {
	var ticket models.Ticket
	if err := c.Bind(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	ticket.Date = time.Now().Format("2006-01-02")
	ticket.Time = time.Now().Format("15:04:05")
	ticket.Status = "Baru"

	if err := models.CreateTicket(ticket); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit ticket"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket submitted successfully"})
}

// UpdateTicketStatusHandler allows the admin to update ticket status.
func UpdateTicketStatusHandler(c *gin.Context) {
	var payload struct {
		TicketID int    `json:"ticket_id"`
		Status   string `json:"status"` // Status: Baru, Dalam Proses, Selesai
	}

	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := models.UpdateTicketStatus(payload.TicketID, payload.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ticket status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket status updated successfully"})
}
