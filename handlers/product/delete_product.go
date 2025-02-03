package product

import (
	"GoProject/migrations"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func DeleteProduct(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		productID, err := strconv.Atoi(id)
		if err != nil || productID <= 0 {
			http.Error(w, "Invalid product ID", http.StatusBadRequest)
			return
		}

		var product migrations.Product
		if err := db.First(&product, productID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Product not found", http.StatusNotFound)
			} else {
				http.Error(w, fmt.Sprintf("Failed to retrieve product: %v", err), http.StatusInternalServerError)
			}
			return
		}

		if err := db.Delete(&product).Error; err != nil {
			http.Error(w, fmt.Sprintf("Failed to delete product: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Product deleted successfully"})
	}
}
