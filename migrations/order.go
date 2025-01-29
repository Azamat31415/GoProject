package migrations

import (
	"gorm.io/gorm"
	"time"
)

type Order struct {
	ID             uint        `gorm:"primaryKey"`
	UserID         uint        `gorm:"not null"`
	DeliveryMethod string      `gorm:"type:varchar(50);not null"`
	PickupPointID  *uint       `gorm:"index"`
	Address        *string     `gorm:"type:text"`
	Status         string      `gorm:"type:varchar(50);default:'pending'"`
	TotalPrice     float64     `gorm:"type:numeric(10,2);not null"`
	CreatedAt      time.Time   `gorm:"autoCreateTime"`
	OrderItems     []OrderItem `gorm:"constraint:OnDelete:CASCADE;"`
}

type OrderItem struct {
	ID        uint      `gorm:"primaryKey"`
	OrderID   uint      `gorm:"not null;index"`
	ProductID uint      `gorm:"not null;index"`
	Quantity  int       `gorm:"not null"`
	Price     float64   `gorm:"type:numeric(10,2);not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}

// MigrateOrder for creation of order/order item table
func MigrateOrder(db *gorm.DB) error {
	return db.AutoMigrate(&Order{}, &OrderItem{})
}
