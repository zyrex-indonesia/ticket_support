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
		username TEXT NOT NULL,
		date TEXT NOT NULL,
		time TEXT NOT NULL,
		description TEXT NOT NULL
	);`
	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
}
