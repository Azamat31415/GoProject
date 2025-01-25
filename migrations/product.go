package migrations

import (
	"gorm.io/gorm"
)

// Product model for products
type Product struct {
	gorm.Model
	Name        string
	Description string
	Price       float64
	Stock       int
	Category    string
}

// MigrateProduct for creation of product table
func MigrateProduct(db *gorm.DB) error {
	return db.AutoMigrate(&Product{})
}
