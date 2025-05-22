package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey;type:bigint unsigned"`
	Name         string    `gorm:"not null"`
	Email        string    `gorm:"not null;unique"`
	Password     string    `gorm:"not null"`
	Dob          time.Time `gorm:"not null"`
	Gender       string    `gorm:"not null"`
	ReferralCode string    `gorm:""`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    *time.Time `gorm:"index"`
}
