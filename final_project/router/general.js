const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const session = require('express-session')
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "You just successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "You are an already registered user!"});    
    }
  } 
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function(req, res) {
  let promise = new Promise(function(resolve, reject) {
  if (Object.keys(books).length === 0) {
  reject({message: "There are no books to display"});
  } else {
  resolve(books);
  }
  });
  
  promise.then(function(books) {
  res.send(JSON.stringify(books, null, 4));
  }).catch(function(error) {
  res.status(300).json(error);
  });
  });
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "There are no books to display"});   
  
});*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;  
  // Create a Promise to get the book with the given ISBN
  const getBookPromise = new Promise((resolve, reject) => {
  if (books[isbn]) {
  resolve(books[isbn]);
  } else {
  reject({message: "No such book was found"});
  }
  });
  
  // Call the Promise and handle the result or error
  getBookPromise
  .then(book => {
  res.send(book);
  return res.status(300).json({message: "Yet to be implemented"});
  })
  .catch(error => {
  res.status(404).json(error);
  });
 });
/*public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });*/
  
// Get book details based on author

public_users.get('/author/:author',function (req, res) {
  const choiceAuthor = req.params.author;

// Create a Promise to find the books with the given author
const findBooksPromise = new Promise((resolve, reject) => {
const authorBooks = [];
for (const key in books) {
const book = books[key];
if (book.author === choiceAuthor) {
authorBooks.push(book);
}
}
if (authorBooks.length > 0) {
resolve(authorBooks);
} else {
reject({message: "No books found for the author"});
}
});

// Call the Promise and handle the result or error
findBooksPromise
.then(authorBooks => {
res.send(authorBooks);
return res.status(300).json({message: "No such author was detected"});
})
.catch(error => {
res.status(404).json(error);
});
});

/*public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const choiceAuthor = req.params.author;
  
  for (const key in books) {
    const book = books[key];
    if (book.author === choiceAuthor){
      res.send(book);
    } 
  }
  return res.status(300).json({message: "No such author was detected"});
});*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const choiceTitle = req.params.title;
  
  for (const key in books) {
    const book = books[key];
    if (book.title === choiceTitle){
      res.send(book);
    } 
  }
  return res.status(300).json({message: "No such book title was found"});
});

//  Get book reviews by ISBN
public_users.get('/review/:isbn', function(req, res) {
  let promise = new Promise((resolve, reject) => {
  for (const bookId in books) {
  if (Object.prototype.hasOwnProperty.call(books, bookId)) {
  const reviews = books[bookId].reviews;
  resolve(reviews);
  }
  }
  reject({message: "No reviews found"});
  });
  
  promise.then((reviews) => {
  res.send(reviews);
  }).catch((err) => {
  res.status(300).json(err);
  });
  });

/*public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  for (const bookId in books) {
    if (Object.prototype.hasOwnProperty.call(books, bookId)) {
      const reviews = books[bookId].reviews;  
      res.send(reviews);
    } 
  } 
  
  return res.status(300).json({message: "No reviews found"});
});*/

module.exports.general = public_users;
