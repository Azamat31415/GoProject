package migrations

import (
	"gorm.io/gorm"
	"time"
)

type Subscription struct {
	ID           uint `gorm:"primaryKey"`
	UserID       uint
	StartDate    time.Time
	RenewalDate  time.Time
	IntervalDays int
	Type         string `gorm:"type:varchar(20)"`
	Status       string `gorm:"type:varchar(20)"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type SubscriptionProduct struct {
	SubscriptionID uint
	ProductID      uint
}

func MigrateSubscription(db *gorm.DB) error {
	return db.AutoMigrate(&Subscription{}, &SubscriptionProduct{})
}
