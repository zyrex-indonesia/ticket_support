package routes

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"ticket_support/models"
	"time"

	"github.com/gin-gonic/gin"
)

// GetTicketsHandler fetches all tickets
func GetTicketsHandler(c *gin.Context) {
	tickets, err := models.GetAllTickets()
	if err != nil {
		log.Printf("Error fetching tickets: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tickets"})
		return
	}
	c.JSON(http.StatusOK, tickets)
}

func SubmitTicketHandler(c *gin.Context) {
	var ticket models.Ticket

	// Parse multipart form
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10 MB max file size
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	// Get form fields
	ticket.Name = c.PostForm("name")
	ticket.Description = c.PostForm("description")
	ticket.Priority = c.PostForm("priority")
	ticket.Category = c.PostForm("category")
	ticket.Status = "Baru" // Default status

	// Handle file upload (if present)
	file, fileHeader, err := c.Request.FormFile("attachment")
	if err == nil {
		defer file.Close()
		filePath := fmt.Sprintf("./uploads/%s", fileHeader.Filename)
		out, err := os.Create(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save attachment"})
			return
		}
		defer out.Close()
		_, err = io.Copy(out, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write attachment"})
			return
		}
		ticket.Attachment = filePath
	} else {
		ticket.Attachment = "" // No file uploaded
	}

	// Validate required fields
	if ticket.Name == "" || ticket.Description == "" || ticket.Priority == "" || ticket.Category == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Set date and time
	ticket.Date = time.Now().Format("2006-01-02")
	ticket.Time = time.Now().Format("15:04:05")

	// Save to database
	if err := models.CreateTicket(ticket); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save ticket"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket submitted successfully"})
}

// UpdateTicketStatusHandler updates the status of a specific ticket
func UpdateTicketStatusHandler(c *gin.Context) {
	var request struct {
		ID     int    `json:"id"`
		Status string `json:"status"`
	}
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := models.UpdateTicketStatus(request.ID, request.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ticket status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket status updated successfully"})
}
