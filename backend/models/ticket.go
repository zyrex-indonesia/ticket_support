package models

import (
	"ticket_support/config"
)

type Ticket struct {
	ID          int    `json:"id"`
	Username    string `json:"username"`
	Description string `json:"description"`
	Priority    string `json:"priority"`
	Category    string `json:"category"`
	Attachment  string `json:"attachment"`
	Status      string `json:"status"`
	CreatedAt   string `json:"created_at"`
	Date        string `json:"date"` // Date of submission
	Time        string `json:"time"` // Time of submission
}

func CreateTicket(ticket Ticket) error {
	query := "INSERT INTO tickets (username, date, time, description) VALUES (?, ?, ?, ?)"
	_, err := config.DB.Exec(query, ticket.Username, ticket.Date, ticket.Time, ticket.Description, ticket.Priority, ticket.Category, ticket.Attachment, ticket.Status, ticket.CreatedAt)
	return err
}

func GetAllTickets() ([]Ticket, error) {
	rows, err := config.DB.Query("SELECT * FROM tickets")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tickets []Ticket
	for rows.Next() {
		var ticket Ticket
		if err := rows.Scan(&ticket.ID, &ticket.Username, &ticket.Description, &ticket.Date, &ticket.Time, &ticket.Priority, &ticket.Category, &ticket.Attachment, &ticket.Status, &ticket.CreatedAt); err != nil {
			return nil, err
		}
		tickets = append(tickets, ticket)
	}
	return tickets, nil
}

func UpdateTicketStatus(ticketID int, status string) error {
	query := "UPDATE tickets SET status = ? WHERE id = ?"
	_, err := config.DB.Exec(query, status, ticketID)
	return err
}
