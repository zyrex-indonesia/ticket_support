package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var credentials map[string]string
	if err := c.BindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hardcoded credentials
	const predefinedUsername = "admin"
	const predefinedPassword = "Zyr3xuser"

	username := credentials["username"]
	password := credentials["password"]

	if username == predefinedUsername && password == predefinedPassword {
		c.JSON(http.StatusOK, gin.H{"token": "admin-token"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}
}
