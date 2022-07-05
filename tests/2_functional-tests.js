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
const { afterEach, after, before } = require('mocha');


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

  /* after(function() {
    Book.deleteMany({ '_id': { $in: [idForPost, idForPost2] } }, (err, data) => {
      if (err) return console.log(err);
      //console.log(data);
    });
  });*/

  afterEach(function() {
    console.log(idForPost);
    console.log(idForPost2);
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
            //assert.isArray(res.body, 'response should be an array');
            assert.equal(res.body.title, 'Don Quixote');
            //console.log("CHECK ", res.body);
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
            assert.equal(res.body, 'missing required book title');
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
            //assert.isArray(res.body, 'response should be an array');
            assert.equal(res.type, 'application/json', 'Response should be of type json');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function() {
      
      test('Test GET /api/books/[id] with id not in db',  function(done) {
        chai
        .request(server)
        .get('/api/books')
        .send({
          id: 12345
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          //assert.isArray(res.body, 'response should be an array');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done) {
        chai
        .request(server)
        .get(`/api/books`)
        .send({
          id: idForPost
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body.title, "Don Quixote", 'The title should be Don Quixote.');
          assert.equal(res.body._id, idForPost);
          console.log(idForPost);
          assert.isArray(res.body.comments);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
        .request(server)
        .post(`/api/books`)
        .send({
          id: idForPost,
          comment: 'el mejor libro literario jamás escrito'
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body._id, idForPost);
          assert.equal(res.body.title, 'Don Quixote');
          assert.equal(res.body.comments[0], 'el mejor libro literario jamás escrito');
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
        .post('/api/books')
        .send({
          id: 12345,
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
        .delete('/api/books')
        .send({
          id: idForPost
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be of type json');
          assert.equal(res.body.title, 'delete successful');
          done(); 
        });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai
        .request(server)
        .delete('/api/books')
        .send({
          id: 12345
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'text', 'Response should be of type text');
          assert.equal(res.body, 'no book exists');
          done();
        });
      });

    });

  });

});
