package product_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

func FetchAllProducts(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Получаем параметры из запроса
		category := r.URL.Query().Get("category")
		subcategory := r.URL.Query().Get("subcategory")
		productType := r.URL.Query().Get("type")

		// Создаем слайс для продуктов
		var products []migrations.Product
		query := db.Model(&migrations.Product{})

		// Добавляем условия для фильтрации
		if category != "" {
			query = query.Where("category = ?", category)
		}
		if subcategory != "" {
			query = query.Where("subcategory = ?", subcategory)
		}
		if productType != "" {
			query = query.Where("type = ?", productType)
		}

		if err := query.Find(&products).Error; err != nil {
			http.Error(w, "Error fetching products", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(products)
	}
}

func FetchProductByID(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		productID, err := strconv.Atoi(id)
		if err != nil {
			http.Error(w, "Invalid product ID", http.StatusBadRequest)
			return
		}
		var product migrations.Product
		if err := db.First(&product, productID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Product not found", http.StatusNotFound)
			} else {
				http.Error(w, "Failed to fetch product", http.StatusInternalServerError)
			}
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(product)
	}
}
