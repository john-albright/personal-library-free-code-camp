/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models/books.js");
const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      
      Book.find({}, (error, data) => {
        if (error) return res.json("error");
      
        // Response will be array of book objects
        // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]  
        return res.json(data);
      });
    })
    
    .post(function (req, res) {
      let title = req.body.title || req.query.title;

      let newBook = new Book({
        title: title
      });

      newBook.save((error, data) => {
        if (error | !data) return res.json('missing required field title');

        //console.log(data);

        // Response will contain new book object including atleast _id and title
        return res.json({
          _id: data._id,
          title: data.title
        })

      });
    })
    
    .delete(function(req, res) {
      //let title = req.body.title; 

      Book.deleteMany({}, (error, data) => {
        if (error | !data) return res.json('no book exists');

        // If successful response will be 'complete delete successful'
        //console.log(data);
        return res.json('complete delete successful');

      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id || req.query.id;

      // Make sure the id is a valid object id
      try {
        mongoose.Types.ObjectId(bookid);
      } catch (error) {
        return res.json('no book exists');
      }


      // Search the database for the book 
      Book.findOne({ _id: bookid }, (error, data) => {
        if (error | !data) return res.json('no book exists');

        // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        return res.json({ 
          _id: data._id, 
          title: data.title, 
          comments: data.comments 
        });

      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment || req.query.comment;

      //console.log(comment);

      if (!comment) return res.json('missing required field comment');

      // Make sure the id is a valid object id
      try {
        mongoose.Types.ObjectId(bookid);
      } catch (error) {
        return res.json('no book exists');
      }

      Book.findOne({ _id: bookid }, (error, data) => {
        if (error | !data) return res.json('no book exists');

        //console.log(data);

        // Get the title of the book from the database
        let bookTitle = data.title;

        // Update total comment count
        let currCommCount = data.commentcount;
        let newCommCount = currCommCount + 1;

        // Add new comment to array
        let commentArray = data.comments; 
        commentArray.push(comment);

        Book.updateOne({ _id: bookid  }, { comments: commentArray, commentcount: newCommCount }, (error, data2) => {
          if (error) return res.json('no book exists');

          //console.log(data2);

          // json res format same as .get
          return res.json({ 
            _id: bookid, 
            title: bookTitle, 
            comments: commentArray
          });

        });

      });  
    })
    
    .delete(function(req, res) {
      let bookid = req.params.id || req.query.id;
      //console.log(bookid);

      Book.deleteOne({ _id: bookid }, (error, data) => {
        if (error | !data) return res.json('no book exists');

        // If successful response will be 'delete successful'
        return res.json('delete successful');
      });
    });
  
};
