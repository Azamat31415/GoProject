package migrations

import (
	"golang.org/x/crypto/bcrypt"
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
	Role      string
}

// UserRegistration for data structure of registration
type UserRegistration struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
}

// HashPassword for hash a password
func (user *User) HashPassword() error {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hash)
	return nil
}

// CheckPassword for checking a password
func (user *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}

// MigrateUser for creation of user table
func MigrateUser(db *gorm.DB) error {
	return db.AutoMigrate(&User{})
}
