'use strict';
const express = require('express');
const router = express.Router();
const {BlogPosts} = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();




function generateText(){//generates text for blog posts
  return (
    `Lorem ipsum dolor amet fanny pack etsy shaman, 3 wolf moon gluten-free you probably havent 
  heard of them aesthetic kombucha salvia trust fund cardigan hexagon. Crucifix 
  before they sold out lo-fi blog. Chillwave artisan chia godard. Single-origin coffee 
  ugh intelligentsia cold-pressed, kombucha letterpress helvetica migas adaptogen 
  sustainable cloud bread tousled fanny pack celiac sriracha.`
  );
}

//set up a fake post
BlogPosts.create('My fake blog post', generateText(), 'Joe Smith');


router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {//creates a new blog post and also checks to make sure that all of the required fields have been fulfilled
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i <requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const errorMessage = `Missing ${field} in request body`;
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  //if we fall out of the loop with no errors, we will end up here and create the new item
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {//recall that put is for updating 
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const errorMessage = `Missing ${field} in request body`;
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }

  if (req.params.id !== req.body.id){
    const errorMessage = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(errorMessage);
  }

  console.log(`Updating blog item \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author:req.body.author,
    publishDate:req.body.publishDate
  });
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});


module.exports = router;
