package migrations

import (
	"gorm.io/gorm"
)

type Pet struct {
	gorm.Model
	Name    string `gorm:"not null"`
	Species string `gorm:"not null"`
	Age     int
	Price   float64
	StoreID uint
	Store   PickupPoint
}

// MigratePet for creation of pet profile table
func MigratePet(db *gorm.DB) error {
	if err := db.AutoMigrate(&Pet{}); err != nil {
		return err
	}
	return nil
}
