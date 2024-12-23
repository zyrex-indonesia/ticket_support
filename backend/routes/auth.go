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

	username := credentials["username"]
	password := credentials["password"]

	if username == "admin" && password == "password" {
		c.JSON(http.StatusOK, gin.H{"token": "admin-token"})
	} else if password == "password" {
		c.JSON(http.StatusOK, gin.H{"token": "user-token"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}
}
