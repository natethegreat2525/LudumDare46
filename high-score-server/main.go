package main

import (
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
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
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "OPTIONS", "POST","PUT", "PATCH"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "*"
		},
		MaxAge: 12 * time.Hour,
	}))
	r.GET("/scores", GetHighScoresHandler)
	r.POST("/score", PostHighScoreHandler)
	log.Println("running server on port 8080")
	r.Run()
}

func GetHighScoresHandler(c *gin.Context) {
	log.Println("received get request for scores")
	sort.Sort(HighScores(currentHighScores))
	c.JSON(http.StatusOK, currentHighScores)
	log.Println("successful get request for scores")
}

func PostHighScoreHandler(c *gin.Context) {
	log.Println("received post request for scores")
	hs := HighScore{}
	if err := c.ShouldBindJSON(&hs); err != nil {
		log.Printf("failed to decode body: %+v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return 
	}
	if hs.Level > 5 || hs.Time < 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "welp, you figured it out ... congrats.",
		})
	}
	currentHighScores = append(currentHighScores, hs)
	sort.Sort(HighScores(currentHighScores))
	reorganizeTopFive()
	c.JSON(http.StatusOK, currentHighScores)
	log.Println("successful post request for scores")
}

func reorganizeTopFive() {
	if len(currentHighScores) > 5 {
		currentHighScores = currentHighScores[:5]
	}
}