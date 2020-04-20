package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type HighScores struct {
	Name string `json:"name"`
	Level int64 `json:"level"`
	Time int64 `json:"time"`
}

var (
	f *os.File
	currentHighScores []HighScores
)

func main() {
	var err error
	f, err = os.OpenFile("highscores.json", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("failed to get highscores file: %+v", err)
	}

	http.HandleFunc("/scores", GetHighScoresHandler)
	http.HandleFunc("/score", PostHighScoreHandler)
	log.Println("running server on port 8080")
	http.ListenAndServe(":8080", nil)
}

func GetHighScoresHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("received get request for scores")
	w.Header().Set("Content-Type", "application/json") 
	json.NewEncoder(w).Encode(currentHighScores) 
	w.WriteHeader(http.StatusOK)
}

func PostHighScoreHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("received post request for scores")
	hs := HighScores{}
	if err := json.NewDecoder(r.Body).Decode(&hs); err != nil {
		log.Fatalf("failed to decode body: %+v", err)
	}
	currentHighScores = append(currentHighScores, hs)
	b, err := json.Marshal(currentHighScores)
	if err != nil {
		log.Fatalf("failed to encode high scores: %+v", err)
	}
	w.Header().Set("Content-Type", "application/json") 
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}
