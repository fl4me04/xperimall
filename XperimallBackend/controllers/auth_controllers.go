package controllers

import (
	"XperimallBackend/database"
	"XperimallBackend/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	Name         string `json:"name" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password" binding:"required"`
	Dob          string `json:"dob" binding:"required"` 
	Gender       string `json:"gender" binding:"required"`
	ReferralCode string `json:"referralCode"`
}


type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Hash password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Check password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Generate JWT Token
func GenerateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// Register
func Register(c *gin.Context) {
	var input RegisterInput
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input",
			"error":   err.Error(),
			"debug":   input, 
		})
		return
	}

	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to hash password"})
		return
	}

	dob, err := time.Parse("2006-01-02", input.Dob)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid date of birth format"})
		return
	}

	user := models.User{
		Name:         input.Name,
		Email:        input.Email,
		Password:     hashedPassword,
		Dob:          dob,
		Gender:       input.Gender,
		ReferralCode: input.ReferralCode,
	}
	result := database.DB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user", "error": result.Error.Error()})
		return
	}

	token, _ := GenerateToken(user.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Registration successful", "token": token})
}


// Login
func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	var user models.User
	result := database.DB.Where("email = ?", input.Email).First(&user)
	if result.Error != nil || !CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	token, _ := GenerateToken(user.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": token, "userId": user.ID, "username": user.Name})
}
