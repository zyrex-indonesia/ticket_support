package config

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./tickets.db")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Create tickets table with the correct schema
	ticketsQuery := `
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, -- User's name
            description TEXT NOT NULL, -- Description of the issue
            priority TEXT NOT NULL, -- Priority: Tinggi, Sedang, Rendah
            category TEXT NOT NULL, -- Category: Jaringan, Hardware, Software, etc.
            attachment TEXT, -- Optional: Path to uploaded file
            status TEXT DEFAULT 'Baru', -- Ticket status: Baru, Dalam Proses, Selesai
            person_in_charge TEXT, -- Name of the person in charge of the ticket
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the ticket was created
            date TEXT NOT NULL, -- Date of submission (YYYY-MM-DD)
            time TEXT NOT NULL  -- Time of submission (HH:MM:SS)
        );`
	if _, err := DB.Exec(ticketsQuery); err != nil {
		log.Fatalf("Failed to initialize tickets table: %v", err)
	}

	// Create users table for managing admin accounts
	usersQuery := `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL, -- Unique username for login
            password TEXT NOT NULL         -- Hashed password for security
        );`
	if _, err := DB.Exec(usersQuery); err != nil {
		log.Fatalf("Failed to initialize users table: %v", err)
	}
}
