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
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            priority TEXT NOT NULL,
            category TEXT NOT NULL,
            attachment TEXT NOT NULL, -- Attachment is NOT NULL
            status TEXT DEFAULT 'Baru',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            progress_start_time DATETIME DEFAULT NULL, -- Allowing NULL
            completed_time DATETIME DEFAULT NULL, -- Allowing NULL
            person_in_charge TEXT NOT NULL, -- Person in charge is NOT NULL
            date TEXT NOT NULL,
            time TEXT NOT NULL
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
