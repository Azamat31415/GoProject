package migrations

import (
	"gorm.io/gorm"
)

type PersonalPet struct {
	gorm.Model
	Name    string `gorm:"not null"`
	Species string `gorm:"not null"`
	Age     int
	UserID  uint `gorm:"not null"`
}

// MigratePersonalPet for creation of pet profile table
func MigratePersonalPet(db *gorm.DB) error {
	if err := db.AutoMigrate(&PersonalPet{}); err != nil {
		return err
	}
	return nil
}
