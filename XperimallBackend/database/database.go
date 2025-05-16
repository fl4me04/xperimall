package database

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"XperimallBackend/models"
)

var DB *gorm.DB

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Warning: Error loading .env file:", err)
		// jangan fatal, supaya server tetap jalan
	}

	dsn := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASS") + "@tcp(" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + ")/" + os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Println("❌ Failed to connect to database:", err)
		// jangan pakai log.Fatal(), karena itu akan stop aplikasi
		return
	}

	DB = db
	log.Println("✅ Database connected successfully")

	db.AutoMigrate(&models.User{}, &models.Category{}, &models.Activity{}, &models.Floor{})
}
