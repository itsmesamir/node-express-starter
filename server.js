const http = require("http");
const url = require("url");
const { parse } = require("querystring");
const data = require("./data");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  switch (method) {
    case "GET":
      if (path === "/api/users") {
        res.statusCode = 200;
        res.end(JSON.stringify(data.users));
      } else if (path.startsWith("/api/users/")) {
        const id = path.split("/").pop();
        const user = data.users.find((u) => u.id === id);
        if (user) {
          res.statusCode = 200;
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "User not found" }));
        }
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Not Found" }));
      }
      break;

    case "POST":
      if (path === "/api/users") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const newUser = JSON.parse(body);
          data.users.push(newUser);
          res.statusCode = 201;
          res.end(JSON.stringify(newUser));
        });
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Not Found" }));
      }
      break;

    case "PUT":
      if (path.startsWith("/api/users/")) {
        const id = path.split("/").pop();
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const updatedUser = JSON.parse(body);
          const index = data.users.findIndex((u) => u.id === id);
          if (index !== -1) {
            data.users[index] = updatedUser;
            res.statusCode = 200;
            res.end(JSON.stringify(updatedUser));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "User not found" }));
          }
        });
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Not Found" }));
      }
      break;

    case "DELETE":
      if (path.startsWith("/api/users/")) {
        const id = path.split("/").pop();
        data.users = data.users.filter((u) => u.id !== id);
        res.statusCode = 204;
        res.end();
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Not Found" }));
      }
      break;

    default:
      res.statusCode = 405;
      res.end(JSON.stringify({ message: "Method Not Allowed" }));
      break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// can test using curl

// curl -X GET http://localhost:3000/api/users
// curl -X GET http://localhost:3000/api/users/1
// curl -X POST -H "Content-Type: application/json" -d '{"id": "8", "name": "Samir Alam", "email": "test@gmail.com"}' http://localhost:3000/api/users
// curl -X PUT -H "Content-Type: application/json" -d '{"id": "8", "name": "Samir Alam", "email": "test@gmail.com"}' http://localhost:3000/api/users/8

// curl -X DELETE http://localhost:3000/api/users/8
// curl -X DELETE http://localhost:3000/api/users/9
