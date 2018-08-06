var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models/index.js");

module.exports = function (app) {

    // home
    app.get("/", function (req, res) {
        db.Article.find({
            saved: false
        })
            .then(function (dbArticle) {
                let hbsObject = {
                    articles: dbArticle
                };
                res.render("home", hbsObject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // scrape website
    app.get("/scrape", function (req, res) {
        db.Article.find({}, function (err, dbArticles) {
            axios.get("http://www.nytimes.com/").then(function (response) {

                let $ = cheerio.load(response.data);
                let counter = 0;

                $("article.story").has("h2").each(function (i, element) {

                    let result = {};
                    result.title = $(element).children("h2").children("a").text();
                    result.link = $(element).children("h2").children("a").attr("href");
                    result.summary = $(element).children("p.summary").text();

                    let duplicate = false;
                    for (let i = 0; i < dbArticles.length; i++) {
                        if (dbArticles[i].title === result.title) {
                            duplicate = true;
                            break;
                        }
                    }
                    if (!duplicate && result.title && result.link && result.summary) {
                        db.Article.create(result);
                        counter++;
                    }
                });
                res.json({
                    count: counter
                });
            });
        });
    });

    // save
    app.get("/saved", function (req, res) {
        db.Article.find({
            saved: true
        })
            .then(function (dbArticle) {
                let hbsObject = {
                    articles: dbArticle
                };
                res.render("saved", hbsObject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // notes
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({
            _id: req.params.id
        })
            .populate("notes")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // find
    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                        $push: {
                            notes: dbNote._id
                        }
                    }, {
                        new: true
                    });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // save article
    app.post("/savearticle/:id", function (req, res) {
        db.Article.findByIdAndUpdate({
            _id: req.params.id
        }, {
                saved: true
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // delete article
    app.post("/deletearticle/:id", function (req, res) {
        db.Article.findByIdAndUpdate({
            _id: req.params.id
        }, {
                saved: false
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // search article
    app.post("/searcharticle/:id", function (req, res) {
        db.Article.findByIdAndUpdate({
            _id: req.params.id
        }, {
                saved: true
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // search notes
    app.post("/searchnote/:id", function (req, res) {
        db.Article.findByIdAndUpdate({
            _id: req.params.id
        }, {
                saved: true
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // delete note
    app.post("/deletenote/:id", function (req, res) {
        db.Note.remove({
            _id: req.params.id
        })
            .then(function (dbNote) {
                res.json(dbNote);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    // clear database
    app.get("/cleardb", function (req, res) {
        db.Article.remove({})
            .then(function () {
                res.send("Cleared!");
            })
            .catch(function (err) {
                res.json(err);
            })
    });
}