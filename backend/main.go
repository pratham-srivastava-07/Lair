package main

import (
	"net/http"
)

func listenWs(w http.ResponseWriter, r *http.Request) {

}

func main() {

	http.ListenAndServe(":9000", nil);
}