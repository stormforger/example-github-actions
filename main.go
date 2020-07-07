package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/stormforger/testapp/server"
)

func main() {
	r := mux.NewRouter()
	server.RegisterStaticHandler(r)

	fmt.Println("example-github-actions server running on :8080")
	http.ListenAndServe(":8080", r)
}
