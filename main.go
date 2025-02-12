package main

import (
	"GoProject/configs"
	"GoProject/migrations"
	"GoProject/routes"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
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
	if err := migrations.MigrateAll(db); err != nil {
		log.Fatal("Failed to apply migrations:", err)
	}

	// Assign admin role to specific user
	if err := migrations.AssignAdminRole(db); err != nil {
		log.Printf("Error assigning admin role: %v", err)
	} else {
		fmt.Println("Admin role assignment complete.")
	}

	// Initialize chi router
	r := chi.NewRouter()

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	r.Use(c.Handler)

	// Set up routes using the InitializeRoutes function
	routes.InitializeRoutes(r, db)

	// Start server
	port := ":8080"
	fmt.Printf("The server is running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
