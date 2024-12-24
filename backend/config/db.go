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

	// Create tickets table if not exists
	query := `
		CREATE TABLE IF NOT EXISTS tickets (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL, -- User who created the ticket
			description TEXT NOT NULL, -- Description of the issue
			priority TEXT NOT NULL, -- Priority: Tinggi, Sedang, Rendah
			category TEXT NOT NULL, -- Category: Jaringan, Hardware, Software, etc.
			attachment TEXT, -- Optional: Path to uploaded file
			status TEXT DEFAULT 'Baru', -- Ticket status: Baru, Dalam Proses, Selesai
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the ticket was created
			date TEXT NOT NULL, -- Date of submission (YYYY-MM-DD)
			time TEXT NOT NULL  -- Time of submission (HH:MM:SS)
		);`
	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
}
