//acquiring packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

//mongoose connection to db
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating instance of express module
const app = express();

//using ejs templates
app.set('view engine', 'ejs');

//using body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//listening to port
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//creating model
const Article = mongoose.model("article", {
  title: {
    type: String,
  },
  content: {
    type: String,
  }
});

//chained route handlers for /article route
app.route("/articles")

  //handling get
  .get(function(req, res) {
    //reading all docs
    Article.find(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    })
  })

  //handling post request to add article
  .post(function(req, res) {
    //creating new article
    let newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    //saving new article to db
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Article added successfully to db.");
      }
    });
  })

  //handling delete request to delete all articles
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles");
      }
    });
  });

//chained route handlers for /articles/:articleTitle
app.route("/articles/:articleTitle")

  //handling get to render an article
  .get(function(req, res) {
    //finding article and sending to client
    Article.findOne(
    //filter
    {
      title: req.params.articleTitle,
    },
    //callback
    function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        if (doc) {
          res.send(doc);
        } else {
          res.send("No article found for the title.");
        }
      }
    });
  })

  //handling put to replace an article
  .put(function(req, res) {
    //filter
    Article.updateOne({
        title: req.params.articleTitle
      },
      //new doc
      {
        title: req.body.title,
        content: req.body.content
      },
      //replace doc even if $set not given by default is false
      {
        overwrite: true
      },
      //callback
      function(err) {
        if (!err) {
          res.send("Successfully updated article.")
        } else {
          res.send(err);
        }
      });
  })

  //handling patch to update fields of an article
  .patch(function(req, res) {
    Article.updateOne(
      //filter
      {
        title: req.params.articleTitle,
      },
      //setting fields whose value is parsed
      {
        $set: req.body
      },
      //callback
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated the article.");
        }
      }
    );
  })

  //handling delete to delete an article
  .delete(function(req,res){
    Article.findOneAndDelete(
      //filter
      {
        title: req.params.articleTitle
      },
      function(err){
        if(err){
          re.send(err);
        }else{
          res.send("Successfully deleted article.")
        }
      }
    );
  });
