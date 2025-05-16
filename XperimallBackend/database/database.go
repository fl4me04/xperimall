func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Warning: Failed to load .env file:", err)
		// lanjutkan walau tanpa .env (Render pakai ENV langsung)
	}

	dsn := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASS") +
		"@tcp(" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + ")/" +
		os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("❌ Failed to connect to database:", err)
		// JANGAN log.Fatal di sini
		return
	}

	DB = db
	log.Println("✅ Database connected successfully")

	db.AutoMigrate(&models.User{}, &models.Category{}, &models.Activity{}, &models.Floor{})
}
