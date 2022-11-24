const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  family:4
});

const articleSchema = {
    title: {type: String, required:true},
    content: {type: String, required:true} 
};

const Article = mongoose.model("Article", articleSchema );

////////////////////////////Request targeting all articles

app.route('/articles')
.get(function(req, res) {
    Article.find({},function(err, foundArticles) { 
        if(err) {
            res.send(err);   
     }else {
        res.send(foundArticles); 
     }});
})
.post(function(req, res) {  
    const newArticle= new Article( {
        title: req.body.title,
        content: req.body.content   
    });

    newArticle.save(function(err){
        if(err) {
                    res.send(err);  }
                    else {
                        res.send("Successfully created article");
                    }   
    });        
})
.delete(function(req, res) {
    Article.deleteMany( function(err){
        if(err) {
            res.send(err);
        }   else    {
            res.send("Successfully deleted all articles");
        }
    });  
});

////////////////////////////Request targeting specific article
app.route('/articles/:articleTitle')

.get(function(req, res) {
    Article.findOne({title:req.params.articleTitle},function(err, foundArticle) { 
        if(foundArticle)  {
            res.send(foundArticle);   
     }else {
        res.send("No Article found with that title"); 
     }});
})
.put(function(req, res){
    Article.findOneAndUpdate({title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(err) {
                res.send(err);  
        }else {
            res.send("Successfully updated article");
        }
    })  ;      
})
.patch(function(req,res){
    Article.findOneAndUpdate({title:req.params.articleTitle},   
        {$set:req.body},        
        function(err){
            if(err) {
                res.send(err);
                }else {
                res.send("Successfully updated article");
                }
            });
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle}, function(err){
        if(err) {
            res.send(err);  
            } else {
            res.send("Successfully deleted article");   
            }
    });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});