package personal_pet_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
)

func AddUserPet(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var pet migrations.PersonalPet
		if err := json.NewDecoder(r.Body).Decode(&pet); err != nil {
			http.Error(w, fmt.Sprintf("Error parsing JSON: %s", err.Error()), http.StatusBadRequest)
			return
		}
		if err := db.Create(&pet).Error; err != nil {
			http.Error(w, "Failed to add pet", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(pet)
	}
}

func EditUserPet(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		var pet migrations.PersonalPet
		if err := db.First(&pet, id).Error; err != nil {
			http.Error(w, "Pet not found", http.StatusNotFound)
			return
		}
		if err := json.NewDecoder(r.Body).Decode(&pet); err != nil {
			http.Error(w, fmt.Sprintf("Error parsing JSON: %s", err.Error()), http.StatusBadRequest)
			return
		}
		if err := db.Save(&pet).Error; err != nil {
			http.Error(w, "Failed to update pet", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(pet)
	}
}

func DeleteUserPet(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		var pet migrations.PersonalPet
		if err := db.First(&pet, id).Error; err != nil {
			http.Error(w, "Pet not found", http.StatusNotFound)
			return
		}
		if err := db.Delete(&pet).Error; err != nil {
			http.Error(w, "Failed to delete pet", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Pet deleted successfully"))
	}
}

func FetchUserPets(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		var pet migrations.PersonalPet
		if err := db.First(&pet, id).Error; err != nil {
			http.Error(w, "Pet not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(pet)
	}
}

func FetchUserPetByID(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "userID")
		var pets []migrations.PersonalPet

		if err := db.Where("user_id = ?", userID).Find(&pets).Error; err != nil {
			http.Error(w, "Pets not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(pets)
	}
}
