const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

const data = require("./data");

// Get all users
app.get("/api/users", (req, res) => {
  res.status(200).json(data.users);
});

// Get user by ID
app.get("/api/users/:id", (req, res) => {
  const user = data.users.find((u) => u.id === req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Create a new user
app.post("/api/users", (req, res) => {
  const newUser = req.body;
  data.users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user by ID
app.put("/api/users/:id", (req, res) => {
  const index = data.users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    data.users[index] = req.body;
    res.status(200).json(data.users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete a user by ID
app.delete("/api/users/:id", (req, res) => {
  data.users = data.users.filter((u) => u.id !== req.params.id);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
