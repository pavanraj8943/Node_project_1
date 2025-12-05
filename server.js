const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const signupEmitter = new EventEmitter();

const VIEWS_DIR = path.join(__dirname, "public");
const PUBLIC_DIR = path.join(__dirname, "scripts");

signupEmitter.on("userSignUp", (newUser) => {
    let users = [];

    if (fs.existsSync("users.json")) {
        const fileData = fs.readFileSync("users.json", "utf-8");
        if (fileData) users = JSON.parse(fileData);
    }
    users.push(newUser);

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    console.log("\nNew User Registered:");
    console.log("Username :", newUser.username);
    console.log("Email    :", newUser.email);
    console.log("Password :", newUser.password);
});

function serveView(file, res) {
    fs.readFile(path.join(VIEWS_DIR, file), (err, data) => {
        if (err) return res.end("Page not found");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}


function serveStatic(file, res) {
    const ext = path.extname(file);
    let type = ext === ".css" ? "text/css" :
        ext === ".js" ? "text/javascript" :
            "text/plain";

    fs.readFile(path.join(PUBLIC_DIR, file), (err, data) => {
        if (err) return res.end("File not found");
        res.writeHead(200, { "Content-Type": type });
        res.end(data);
    });
}
const url = require("url");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(req.method, req.url);

    if (pathname.startsWith("/scripts/")) {
        return serveStatic(pathname.replace("/scripts/", ""), res);
    }

    if (req.method === "GET") {
        if (pathname === "/") return serveView("index.html", res);
        if (pathname === "/login") return serveView("login.html", res);
        if (pathname === "/signup") return serveView("signup.html", res);

        if (pathname === "/users") {
            let users = [];

            if (fs.existsSync("users.json")) {
                users = JSON.parse(fs.readFileSync("users.json", "utf-8") || "[]");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(users));
        }
    }
    if (req.method === "POST" && req.url === "/signup") {
        let chunks = [];

        req.on("data", (c) => chunks.push(c));

        req.on("end", () => {
            const body = Buffer.concat(chunks).toString();
            const { username, email, password } = JSON.parse(body);

            const newUser = { username, email, password };

            signupEmitter.emit("userSignUp", newUser);

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Signup Successful!");
        });
    }
});

server.listen(3001, () => {
    console.log("Server running on 3001");
});
