const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const user = users.filter(user => user.username === username && user.password === password);

        if (user.length > 0) {
            // Generate JWT access token
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });
            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).json({ message: "User successfully logged in." });
        }
        else
            return res.status(404).json({ message: "Wrong username or password" });
    }
    else
        return res.status(404).json({ message: "Missing data" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    const username = req.session.authorization["username"];
    const review = req.query.review;
    if (book != null) {
        books[isbn].reviews[username] = review;
        return res.status(202).json({ message: "Sent!" });
    }
    else
        return res.status(404).json({ message: "Wrong ISBN" });


});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];
    if (books[isbn] != null) {
        books[isbn].reviews[username].delete;
        return res.status(202).json({ message: "Deleted!" });
    }
    else
        return res.status(404).json({ message: "Wrong ISBN" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
