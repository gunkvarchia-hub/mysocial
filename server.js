const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// файлы
const USERS_FILE = "users.json";
const POSTS_FILE = "posts.json";

// загрузка данных
let users = [];
let posts = [];

if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

if (fs.existsSync(POSTS_FILE)) {
  posts = JSON.parse(fs.readFileSync(POSTS_FILE));
}

// регистрация
app.post("/register", (req, res) => {
  const { login, password } = req.body;

  if (users.find(u => u.login === login)) {
    return res.send("Пользователь уже есть");
  }

  users.push({ login, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));

  res.send("ok");
});

// логин
app.post("/login", (req, res) => {
  const { login, password } = req.body;

  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.send("Ошибка");
  }

  res.json({ login });
});

// посты
app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/post", (req, res) => {
  posts.unshift(req.body);
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts));
  res.send("ok");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server started on 3000");
});
