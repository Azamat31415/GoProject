package main

import (
	config "GoProject/configs"
	"GoProject/migrations"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

func main() {
	// Settings for connect to PostgreSQL
	dsn := config.GetDSN()
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Performing migrations
	if err := migrations.MigrateUser(db); err != nil {
		log.Fatal("Failed to run user migration:", err)
	}

	if err := migrations.MigrateProduct(db); err != nil {
		log.Fatal("Failed to run product migration:", err)
	}

	if err := migrations.MigratePet(db); err != nil {
		log.Fatal("Failed to run pet migration:", err)
	}

	if err := migrations.MigrateOrder(db); err != nil {
		log.Fatal("Failed to run order migration:", err)
	}

	if err := migrations.MigratePickupPoint(db); err != nil {
		log.Fatal("Failed to run pickup point migration:", err)
	}

	fmt.Println("Migrations applied successfully!")
}
