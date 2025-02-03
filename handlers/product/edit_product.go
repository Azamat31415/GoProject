package product

import (
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

// EditProduct handles a query for editing a product
func EditProduct(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		productID, err := strconv.Atoi(id)
		if err != nil {
			http.Error(w, "Invalid product ID", http.StatusBadRequest)
			return
		}

		var product migrations.Product
		if err := db.First(&product, productID).Error; err != nil {
			http.Error(w, "Product not found", http.StatusNotFound)
			return
		}

		var updatedProduct migrations.Product
		if err := json.NewDecoder(r.Body).Decode(&updatedProduct); err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		product.Name = updatedProduct.Name
		product.Description = updatedProduct.Description
		product.Price = updatedProduct.Price
		product.Stock = updatedProduct.Stock
		product.Category = updatedProduct.Category

		if err := db.Save(&product).Error; err != nil {
			http.Error(w, "Failed to update product", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(product)
	}
}
