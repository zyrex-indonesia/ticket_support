package models

import (
	"ticket_support/config"
)

type Ticket struct {
	ID          int    `json:"id"`
	Username    string `json:"username"`
	Date        string `json:"date"`
	Time        string `json:"time"`
	Description string `json:"description"`
}

func CreateTicket(ticket Ticket) error {
	query := "INSERT INTO tickets (username, date, time, description) VALUES (?, ?, ?, ?)"
	_, err := config.DB.Exec(query, ticket.Username, ticket.Date, ticket.Time, ticket.Description)
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
		if err := rows.Scan(&ticket.ID, &ticket.Username, &ticket.Date, &ticket.Time, &ticket.Description); err != nil {
			return nil, err
		}
		tickets = append(tickets, ticket)
	}
	return tickets, nil
}
