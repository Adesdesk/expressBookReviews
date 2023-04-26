const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
};

const authenticatedUser = (username,password)=>{ //returns boolean
// code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
const password = req.body.password;
if (!username || !password) {
  return res.status(404).json({message: 'Error logging in. The username or password is invalid.'})
}
else if (authenticatedUser(username, password)){
  let accessToken = jwt.sign(
    {data: password,
          },
          'access',
          {expiresIn: 60 * 60}
      );
  req.session.authorization = {
    accessToken,
          username,
  }
  return res.status(200).send('User successfully logged in')
}
  else {
      console.log('Check3');
      return res.status(208).json({message: 'Invalid Login. Check username and password'})
  }
});
// tested in postman using http://localhost:5000/customer/login

// Adding a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];
  
  // Check if user is authenticated
  if (!username) {
    return res.status(401).json({ message: "You are an unauthorized user" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the review for the book
  books[isbn].reviews[username] = review;

  // Return the updated book object
  return res.json(books[isbn]);
});
// tested in postman using http://localhost:5000/customer/auth/review/3?review=This%20book%20is%20great

// deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];
  
  // Check if user is authenticated
  if (!username) {
    return res.status(401).json({ message: "You are an unauthorized user" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "No such book was found" });
  }

  // Check if the user has previously reviewed the book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "You have no reviews to delete" });
  }

  // Delete the user's review for the book
  delete books[isbn].reviews[username];

  // Return the updated book object
  return res.json(books[isbn]);
});
// tested in postman using http://localhost:5000/customer/auth/review/3

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;