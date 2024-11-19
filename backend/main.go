package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

// Secret key used for JWT token signing
var jwtSecretKey = []byte("YourSuperSecretKey")

// User struct for login request
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// JWT Claims structure
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func main() {
	r := mux.NewRouter()

	// Apply CORS middleware
	r.Use(enableCORS)

	// Routes
	r.HandleFunc("/login", LoginHandler).Methods("POST", "OPTIONS")

	log.Println("Starting server on :8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// LoginHandler - Handles user login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Validate user credentials (hardcoded for demo)
	if user.Username != "admin" || user.Password != "password" {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token, err := GenerateJWT(user.Username)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Respond with token
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}

// GenerateJWT - Generates a JWT token
func GenerateJWT(username string) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}

// enableCORS - Middleware to handle CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3002")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
