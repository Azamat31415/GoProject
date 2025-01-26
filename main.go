package main

import (
	"GoProject/configs"
	"GoProject/migrations"
	"GoProject/routes"
	"fmt"
	"github.com/go-chi/chi/v5"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
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

	if err := migrations.MigrateOrder(db); err != nil {
		log.Fatal("Failed to run order migration:", err)
	}

	if err := migrations.MigratePet(db); err != nil {
		log.Fatal("Failed to run pet migration:", err)
	}

	if err := migrations.MigratePickupPoint(db); err != nil {
		log.Fatal("Failed to run pickup point migration:", err)
	}

	fmt.Println("Migrations applied successfully!")

	// Initialize chi router
	r := chi.NewRouter()

	// Set up routes using the InitializeRoutes function
	routes.InitializeRoutes(r, db)

	// Start server
	port := ":8080"
	fmt.Printf("The server is running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
