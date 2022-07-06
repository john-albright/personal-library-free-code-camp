/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/books.js');
const { after, before } = require('mocha');


chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */

 /*

  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  */

  /*
  * ----[END of EXAMPLE TEST]----
  */

  var idForPost = null;
  var idForPost2 = null;

  before(function() {
    const newBook = new Book({
      title: 'The Awakening'
    });

    newBook.save((error, data) => {
      if (error) return console.log(error);
      idForPost2 = data._id.valueOf(); // valueOf() converts the ObjectId into a string
      //console.log(data._id);
    });
  });

  after(function() {
    Book.deleteMany({ '_id': { $in: [idForPost, idForPost2] } }, (err, data) => {
      if (err) return console.log(err);
      //console.log(data);
    });
  });

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: "Don Quixote"
          })
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.type, 'application/json', 'Response should be of type json');
            assert.equal(res.body.title, 'Don Quixote');
            idForPost = res.body._id; // Save id of the successful post to be used later
            done();
          });

      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.equal(res.type, 'application/json', 'Response should be of type json');
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function() {
      
      test('Test GET /api/books',  function(done) {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200, 'Response status should be 200');
            assert.isArray(res.body, 'response should be an array');
            assert.equal(res.type, 'application/json', 'Response should be of type json');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function() {
      
      test('Test GET /api/books/[id] with id not in db',  function(done) {
        chai
        .request(server)
        .get('/api/books/12345')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done) {
        chai
        .request(server)
        .get(`/api/books/${idForPost}`)
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body.title, "Don Quixote", 'The title should be Don Quixote.');
          assert.isArray(res.body.comments, 'The comments should be of type array');
          assert.equal(res.body._id, idForPost);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
        .request(server)
        .post(`/api/books/${idForPost}`)
        .send({
          comment: 'el mejor libro literario jamás escrito'
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body.title, 'Don Quixote');
          assert.equal(res.body.comments[0], 'el mejor libro literario jamás escrito');
          assert.equal(res.body._id, idForPost);
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai
        .request(server)
        .post(`/api/books/${idForPost}`)
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai
        .request(server)
        .post('/api/books/12345')
        .send({
          comment: 'This is a boring book.'
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai
        .request(server)
        .delete(`/api/books/${idForPost}`)
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body, 'delete successful');
          done(); 
        });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai
        .request(server)
        .delete('/api/books/5f665eb46e296f6b9b6a504d')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body, 'no book exists');
          done();
        });
      });

    });

  });

});
