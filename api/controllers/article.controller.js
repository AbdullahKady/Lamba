var mongoose = require('mongoose'),
    moment = require('moment'),
    jsdom = require("jsdom"),
    Validations = require('../utils/validations'),
    User = mongoose.model('User'),
    Child = mongoose.model('Child'),
    Article = mongoose.model('Article');

const { JSDOM } = jsdom;

module.exports.getArticles = function (req, res, next) {
    //If he's a child, no need for further checks since the token is coming from the server (using the secret)
    if (req.decodedToken.user.username) {
        let id = req.decodedToken.user._id;
        Child.findById(id, (err, child) => {
            if (err) {
                return next(err);
            }
            if (!child) {
                return res.status(404).json({
                    err: null,
                    msg: 'Child not found.',
                    data: null
                });
            }
            //Find all articles with the IDs in the child's profile, and only return back the ones approved
            let articlesIDs = child.allowedArticles;
            Article.find({
                _id: { $in: articlesIDs },
                approved: { $eq: true }
            },
                (err, result) => {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).json({
                        err: null,
                        msg: 'Articles retrieved successfully.',
                        data: result
                    });
                });
        });
    } else {
        Article.find({ approved: true }, (err, result) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                err: null,
                msg: 'Articles retrieved successfully.',
                data: result
            });
        });
    }
};

module.exports.createArticle = function (req, res, next) {

    if (req.decodedToken.user.role === 'Child') {
        return res.status(401).json({
            err: null,
            msg: "You don't have permissions to post (child account)",
            data: null
        });
    }
    var valid =
        req.body.title && Validations.isString(req.body.title) &&
        req.body.content && Validations.isString(req.body.content);
    if (!valid) {
        return res.status(422).json({
            err: null,
            msg: 'title(String), owner_id(String), and content(String) are required fields.',
            data: null
        });
    }

    if (req.body.tags && !Validations.isArray(req.body.tags)) {
        return res.status(422).json({
            err: null,
            msg: 'tags must be an Array type.',
            data: null
        });
    }

    User.findById(req.decodedToken.user._id).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res
                .status(404)
                .json({ err: null, msg: 'User not found.', data: null });
        }

        const content = transformHtml(req.body.content);
        let article = {
            owner_id: req.decodedToken.user._id,
            title: req.body.title,
            content,
            tags: req.body.tags
        };

        Article.create(article, (err, newArticle) => {
            if (err) {
                console.log(err)
                return next(err);
            }
            res.status(201).json({
                err: null,
                msg: 'Article created successfully.',
                data: newArticle.toObject()
            });
        });
    });
};


module.exports.feedbackArticle = function (req, res, next) {
    let valid = req.body.mode &&
        Validations.isString(req.body.mode) &&
        req.body.article_id &&
        Validations.isString(req.body.article_id);
    if (!valid) {
        return res.status(422).json({
            err: null,
            msg: 'article_id(String), and mode(String) are required fields.',
            data: null
        });
    }
    let MODE = req.body.mode;
    if (MODE !== "upvote" && MODE !== "downvote") {
        return res.status(422).json({
            err: null,
            msg: 'mode(String) must be either "downvote" or "upvote".',
            data: null
        });
    }
    //He passed the middleware, thus authenticated. Get user's id
    let userID = req.decodedToken.user._id;
    Article.findById(req.body.article_id, (err, retrievedArticle) => {
        if (err) { return next(err); }
        console.log(retrievedArticle);
        if (MODE == "upvote") {
            upvote(retrievedArticle, userID, res, next);
        } else {
            downvote(retrievedArticle, userID, res, next);
        }
    });
}

const upvote = function (article, id, res, next) {
    if (article.upvoters.includes(id)) {
        return res.status(200).json({
            err: null,
            msg: "Already upvoted",
            data: null
        });
    } else if (article.downvoters.includes(id)) {
        article.downvoters.splice(article.downvoters.indexOf(id), 1);
    }
    article.upvoters.push(id);
    article.save(function (err, updatedArticle) {
        if (err) { return next(err) }
        return res.status(200).json({
            err: null,
            msg: "Successfully upvoted.",
            data: updatedArticle
        });
    });
}

const downvote = function (article, id, res, next) {
    if (article.downvoters.includes(id)) {
        return res.status(200).json({
            err: null,
            msg: "Already downvoted",
            data: null
        });
    } else if (article.upvoters.includes(id)) {
        article.upvoters.splice(article.upvoters.indexOf(id), 1);
    }
    article.downvoters.push(id);
    article.save(function (err, updatedArticle) {
        if (err) { return next(err); }
        return res.status(200).json({
            err: null,
            msg: "Successfully updated.",
            data: updatedArticle
        });
    });
}



//Transforms HTML generated by quill, adds bootstrap structure for embedded videos
const transformHtml = (html) => {
    const dom = new JSDOM(html);

    const document = dom.window.document;

    document.querySelectorAll('iframe').forEach(element => {
        element.classList.add('embed-responsive-item');
        element.classList.remove('ql-video');

        const parent = element.parentNode;
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('embed-responsive', 'embed-responsive-16by9');

        parent.replaceChild(wrapperDiv, element);
        wrapperDiv.appendChild(element);
    });
    let result = dom.serialize();
    console.log(result.substring(25,result.length - 14));
    return result.substring(25,result.length - 14);
};