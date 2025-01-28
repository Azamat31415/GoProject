package migrations

import (
	"gorm.io/gorm"
)

// Order model for orders
type Order struct {
	gorm.Model
	UserID        uint
	User          User
	Status        string
	Total         float64
	OrderItems    []OrderItem
	PickupPointID uint
	PickupPoint   PickupPoint
}

// OrderItem model for order items
type OrderItem struct {
	gorm.Model
	OrderID   uint
	Order     Order
	ProductID uint
	Product   Product
	Quantity  int
	Price     float64
}

// MigrateOrder for creation of order/order item table
func MigrateOrder(db *gorm.DB) error {
	if err := db.AutoMigrate(&Order{}, &OrderItem{}); err != nil {
		return err
	}
	return nil
}
