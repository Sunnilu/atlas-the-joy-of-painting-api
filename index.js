const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
    console.log(request.url)
    response.end("Running")
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if(err) {
        return console.log("Error", err)
    }
    console.log(`Listening on port ${port}`)
})