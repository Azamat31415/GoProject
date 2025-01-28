package migrations

import (
	"gorm.io/gorm"
)

// PickupPoint model for pickup points
type PickupPoint struct {
	gorm.Model
	Name    string
	Address string
	Phone   string
	Orders  []Order
}

// MigratePickupPoint for creation of pickup point table
func MigratePickupPoint(db *gorm.DB) error {
	if err := db.AutoMigrate(&PickupPoint{}, &Order{}); err != nil {
		return err
	}
	return nil
}
