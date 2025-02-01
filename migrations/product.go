package migrations

import (
	"gorm.io/gorm"
)

// Product model for products
type Product struct {
	gorm.Model
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
	Subcategory string  `json:"subcategory"`
	Type        string  `json:"type"`
}

// MigrateProduct for creation of product table
func MigrateProduct(db *gorm.DB) error {
	return db.AutoMigrate(&Product{})
}
