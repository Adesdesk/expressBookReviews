const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const session = require('express-session')
const jwt = require('jsonwebtoken');

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username) && !doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "You just successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "You are an already registered user!"});    
    }
  } 
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
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
  const choiceAuthor = req.params.author;
  
  for (const key in books) {
    const book = books[key];
    if (book.author === choiceAuthor){
      res.send(book);
    } 
  }
  return res.status(300).json({message: "No such author was detected"});
});

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
