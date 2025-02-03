package migrations

import (
	"gorm.io/gorm"
)

type CartItem struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `json:"user_id"`
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

func MigrateCart(db *gorm.DB) error {
	return db.AutoMigrate(&CartItem{})
}
