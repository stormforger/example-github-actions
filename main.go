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

	fmt.Println("Hello World!")
	http.ListenAndServe(":8080", r)
}
