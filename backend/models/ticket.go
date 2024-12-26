package models

import (
	"log"
	"ticket_support/config"
)

type Ticket struct {
	ID             int    `json:"id"`
	Name           string `json:"name" form:"name"`
	Description    string `json:"description" form:"description"`
	Priority       string `json:"priority" form:"priority"`
	Category       string `json:"category" form:"category"`
	Attachment     string `json:"attachment,omitempty" form:"attachment"`
	Status         string `json:"status" form:"status"`
	PersonInCharge string `json:"person_in_charge,omitempty" form:"person_in_charge"`
	CreatedAt      string `json:"created_at" form:"created_at"`
	Date           string `json:"date" form:"date"`
	Time           string `json:"time" form:"time"`
}

func CreateTicket(ticket Ticket) error {
	query := `INSERT INTO tickets (name, description, priority, category, attachment, status, person_in_charge, date, time)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query, ticket.Name, ticket.Description, ticket.Priority, ticket.Category, ticket.Attachment, ticket.Status, ticket.PersonInCharge, ticket.Date, ticket.Time)
	return err
}

func GetAllTickets() ([]Ticket, error) {
	query := `SELECT id, name, description, priority, category, attachment, status, person_in_charge, created_at, date, time FROM tickets`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Printf("Error querying tickets: %v", err)
		return nil, err
	}
	defer rows.Close()

	var tickets []Ticket
	for rows.Next() {
		var ticket Ticket
		if err := rows.Scan(
			&ticket.ID, &ticket.Name, &ticket.Description,
			&ticket.Priority, &ticket.Category, &ticket.Attachment,
			&ticket.Status, &ticket.PersonInCharge, &ticket.CreatedAt,
			&ticket.Date, &ticket.Time,
		); err != nil {
			log.Printf("Error scanning row: %v", err)
			return nil, err
		}
		tickets = append(tickets, ticket)
	}
	return tickets, nil
}

func UpdateTicketStatusAndPerson(ticketID int, status, personInCharge string) error {
	query := "UPDATE tickets SET status = ?, person_in_charge = ? WHERE id = ?"
	_, err := config.DB.Exec(query, status, personInCharge, ticketID)
	return err
}
