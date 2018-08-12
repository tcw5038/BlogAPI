'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog API Tests', function() {
  //Starts and stops the server
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it('should list blog post items on GET', function() {
    return chai
      .get('blog-posts')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
      });//end of then
  });//end of it/GET

  it('should add an item on POST', function(){
    const newItem = { title: 'My Blog Post', content: 'Fake content here', author:'Joe Smith' };
    return chai
      .post('blog-posts')
      .send(newItem)
      .then(function(res){
        expect(res).to.have.status(201);//since it won't return anything in the body
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content', 'author');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  it('should update blog post items on PUT', function() {
    const updateData = { title: 'My Blog Post updated', content: 'Fake content here updated', author:'Joe Smith updated' };
    return (
      chai
        .request(app)
        .get('/blog-posts')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
            .request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal(updateData);
        })
    );
  });

  it('should delete blog post items on DELETE', function() {
    return (
      chai
        .request(app)
        .get('/blog-posts')
        .then(function(res) {
          return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);//204 because nothing comes back in the body
        })
    );
  });
});//describe function end