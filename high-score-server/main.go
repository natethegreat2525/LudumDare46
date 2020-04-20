package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
)

type HighScore struct {
	Name string `json:"name"`
	Level int64 `json:"level"`
	Time int64 `json:"time"`
}

type HighScores []HighScore

func (hs HighScores) Len() int {
	return len(hs)
}

func (hs HighScores) Swap(i int, j int) {
	hs[i], hs[j] = hs[j], hs[i]
}

func (hs HighScores) Less(i int, j int) bool {
	// check if higher level
	l := hs[i].Level == hs[j].Level
	if l {
		t := hs[i].Time < hs[j].Time
		return t
	}
	l = hs[i].Level > hs[j].Level
	return l
}

var (
	currentHighScores = make([]HighScore, 0)
)

func main() {
	http.HandleFunc("/scores", GetHighScoresHandler)
	http.HandleFunc("/score", PostHighScoreHandler)
	log.Println("running server on port 8080")
	http.ListenAndServe(":8080", nil)
}

func GetHighScoresHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("received get request for scores")
	w.Header().Set("Content-Type", "application/json") 
	sort.Sort(HighScores(currentHighScores))
	json.NewEncoder(w).Encode(currentHighScores) 
	log.Println("successful get request for scores")
}

func PostHighScoreHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("received post request for scores")
	hs := HighScore{}
	if err := json.NewDecoder(r.Body).Decode(&hs); err != nil {
		log.Printf("failed to decode body: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
	}
	currentHighScores = append(currentHighScores, hs)
	go reorganizeTopFive()
	sort.Sort(HighScores(currentHighScores))
	w.WriteHeader(http.StatusOK)
	log.Println("successful post request for scores")
}

func reorganizeTopFive() {
	if len(currentHighScores) > 5 {
		currentHighScores = currentHighScores[:5]
	}
}