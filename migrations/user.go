package migrations

import (
	"gorm.io/gorm"
)

// User model for users
type User struct {
	gorm.Model
	Email     string `gorm:"unique"`
	Password  string
	FirstName string
	LastName  string
	Address   string
	Phone     string
}

// MigrateUser for creation of user table
func MigrateUser(db *gorm.DB) error {
	return db.AutoMigrate(&User{})
}
