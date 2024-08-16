const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (users.filter(user => user === username).length === 0) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        }
        else
            return res.status(404).json({ message: "User already registered" });
    }
    else
        return res.status(404).json({ message: "Missing data" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject('No books found');
        }
    })
        .then(bookList => {
            res.send(JSON.stringify(bookList));
        })
        .catch(error => {
            res.status(500).send('Error fetching the book list');
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject('No book found');
        }
    })
        .then(book => {
            res.send(JSON.stringify(book));
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    new Promise((resolve, reject) => {
        let book = [];
        for (let k in books) {
            if (books[k].author == req.params.author) {
                book.push(books[k]);
            }
        }

        if (book.length > 0)
            resolve(book);
        else
            reject("Author not found");

    })
        .then(book => {
            res.send(JSON.stringify(book));
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
        let book;
        for (let k in books) {
            if (books[k].title == req.params.title) {
                book = books[k];
            }
        }

        if (book != null)
            resolve(book);
        else
            reject("Book not found");

    })
        .then(bookList => {
            res.send(JSON.stringify(bookList));
        })
        .catch(error => {
            res.status(500).send('Error fetching the book list');
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn
    if (books[isbn] != null)
        res.send(JSON.stringify(books[isbn].reviews));
    else
        res.send("Book not found");
});

module.exports.general = public_users;
