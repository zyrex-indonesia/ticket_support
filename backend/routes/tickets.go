package routes

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"ticket_support/config"
	"ticket_support/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-gomail/gomail"
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

	// Send email notification
	go sendEmailNotification(ticket)

	c.JSON(http.StatusOK, gin.H{"message": "Ticket submitted successfully"})
}

// sendEmailNotification sends an email to the admin when a ticket is submitted
func sendEmailNotification(ticket models.Ticket) {
	mailer := gomail.NewMessage()
	mailer.SetHeader("To", "MiaTampi@ezyrex.com")
	mailer.SetHeader("Subject", "New Ticket Submitted")
	mailer.SetBody("text/plain",
		fmt.Sprintf("A new ticket has been submitted.\n\nName: %s\nDescription: %s\nPriority: %s\nCategory: %s\nDate: %s\nTime: %s",
			ticket.Name, ticket.Description, ticket.Priority, ticket.Category, ticket.Date, ticket.Time))

	dialer := gomail.NewDialer("smtp.example.com", 587, "FrederickRicoHartanto@zyrex.com", "Zyr3xuser")

	if err := dialer.DialAndSend(mailer); err != nil {
		log.Printf("Failed to send email: %v", err)
	}
}

func UpdateTicketHandler(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Status         string `json:"status"`
		PersonInCharge string `json:"person_in_charge"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Initialize nullable fields
	var progressStartTime sql.NullString
	var completedTime sql.NullString

	// Set progress_start_time if status is "Dalam Proses"
	if request.Status == "Dalam Proses" {
		progressStartTime = sql.NullString{String: time.Now().Format("2006-01-02 15:04:05"), Valid: true}
	} else {
		progressStartTime = sql.NullString{Valid: false}
	}

	// Set completed_time if status is "Selesai"
	if request.Status == "Selesai" {
		completedTime = sql.NullString{String: time.Now().Format("2006-01-02 15:04:05"), Valid: true}
	} else {
		completedTime = sql.NullString{Valid: false}
	}

	// Update query
	query := `
        UPDATE tickets 
        SET status = ?, 
            person_in_charge = ?, 
            progress_start_time = CASE WHEN ? THEN ? ELSE progress_start_time END, 
            completed_time = CASE WHEN ? THEN ? ELSE completed_time END 
        WHERE id = ?
    `
	result, err := config.DB.Exec(query,
		request.Status,
		request.PersonInCharge,
		progressStartTime.Valid, progressStartTime.String,
		completedTime.Valid, completedTime.String,
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ticket"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket updated successfully"})
}
