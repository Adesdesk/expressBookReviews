const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "You are an already registered user!"});    
    }
  } 
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "There are no books to display"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let result = [];
  for(let key in books) {
    if(books[key].author === author) {
      result.push(books[key]);
    }
  }
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let choiceTitle = req.params.title;
  let resultt = [];
  for(let key in books) {
    if(books[key].title === choiceTitle) {
      resultt.push(books[key]);
    }
  }
  return res.status(200).json(resultt);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  for (const bookId in books) {
    if (Object.prototype.hasOwnProperty.call(books, bookId)) {
      const reviews = books[bookId].reviews;  
      res.send(reviews);
    } 
  } 
  
  return res.status(300).json({message: "No reviews found"});
});

module.exports.general = public_users;