package models

import "time"

type Expense struct {
	ID        uint    `gorm:"primaryKey"`
	Tenant    string  `gorm:"not null"`
	Amount    float64 `gorm:"not null"`
	UserID    uint    `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `gorm:"index"`
}
