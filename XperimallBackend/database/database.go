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
        log.Fatal("Error loading .env file")
    }

    dsn := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASS") + "@tcp(" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + ")/" + os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    DB = db
    log.Println("Database connected successfully")

    db.AutoMigrate(&models.User{})
}
