//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const req = require("express/lib/request");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true} )

const articles_schema ={
    title: String,
    content: String
}

const Article = mongoose.model("Article", articles_schema)


app.route("/articles")
.get(
    function(req,res){
    Article.find(function(err, found_articles){
        if (!err){
            res.send(found_articles)
        }else{
            res.send(err)
        }
    })
})
.post(
    function(req, res){
        console.log(req.body.title)
        console.log(req.body.content)
        const new_article = new Article({
            title: req.body.title,
            content: req.body.content
        })
        new_article.save(function(err){
            if(!err){
                res.send("succecssfully to add")
            }
        })
    })
.delete(
    function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully to delete")
            }else{
                res.send(err)
            }
        })
    }
)
 

///////////////////////// Requests Targetting A specific article //////////////

app.route("/articles/:articles_title")
.get(function(req,res){
    Article.findOne({title:     req.params.articles_title    }, function(err, found_articles){
        if (found_articles){
            res.send(found_articles)
        }else{
            res.send("No articles matching that title was found.")
        }
    }
    )
})

.put(function(req, res){

    Article.updateOne(
      {title: req.params.articles_title},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
  
  .patch(function(req, res){
  
    Article.updateOne(
      {title: req.params.articles_title},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  
  .delete(function(req, res){
  
    Article.deleteOne(
      {title: req.params.articles_title},
      function(err){
        if (!err){
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      }
    );
  });
  

app.listen(3000, function() {
  console.log("Server started on port 3000");
});