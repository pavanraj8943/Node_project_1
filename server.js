const http = require('http');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const signupEmitter = new EventEmitter();



signupEmitter.on("new_signup", (user) => {
    console.log("\nNew user signed up:");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Password:", user.password);

    
});


const pages = {
    "/": "index.html",
    "/login": "login.html",
    "/signup": "signup.html"
};

const server = http.createServer((req, res) => {
    const { method, url } = req;
    const staticPath = path.join(__dirname, "public", url);
    if (fs.existsSync(staticPath) && fs.lstatSync(staticPath).isFile()) {
        let contentType = "text/plain";

        if (url.endsWith(".js")) contentType = "application/javascript";
        if (url.endsWith(".css")) contentType = "text/css";
        if (url.endsWith(".html")) contentType = "text/html";

        res.writeHead(200, { "Content-Type": contentType });
        return res.end(fs.readFileSync(staticPath));
    }
    if (method === 'GET') {
        if (pages[url]) {
            const filePath = path.join(__dirname, 'public', pages[url]);
            return render(res, filePath);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 Not Found');
        }
    }

    if (method === "POST" && url === "/signup") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            const raw = Buffer.concat(body).toString();
            const { username, email, password } = JSON.parse(raw);
            const user = {
                username,
                email,
                password
            }
            signupEmitter.emit("new_signup", user);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Signup successful!" }));

        });

        return;
    }



}).listen(3006, () => {
    console.log('Server is running on 3006');
});

function render(res, pagePath) {
    fs.readFile(pagePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}
