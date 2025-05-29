package models

import "time"

type Tenant struct {
	ID          uint       `json:"id" gorm:"primaryKey;table:new_tenants"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Location    string     `json:"location"`
	FloorID     uint       `json:"floor_id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty" gorm:"index"`
}
