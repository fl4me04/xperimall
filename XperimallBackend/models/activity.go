package models

import "time"

type Activity struct {
	ID         uint   `gorm:"primaryKey"`
	Name       string `gorm:"not null"`
	PriceMin   int
	PriceMax   int
	CategoryID uint
	Category   Category
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  *time.Time `gorm:"index"`
}
