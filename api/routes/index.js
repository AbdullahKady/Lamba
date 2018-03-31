var express = require('express'),
  router = express.Router(),
  authCtrl = require('../controllers/auth.controller'),
  userCtrl=require('../controllers/user.controller'),
  mw = require('./middlewares');

//---------------------------- Authentication Routes --------------------------------//
router.post('/auth/register', mw.isNotAuthenticated, authCtrl.register);
router.post('/auth/login', mw.isNotAuthenticated, authCtrl.login);
router.post('/auth/child', mw.isAuthenticated, mw.isNotChild, authCtrl.addChild);
router.post('/auth/admin', mw.isAuthenticated, authCtrl.addAdmin);
//------------------------------Admin Routes---------------------------------//
//yasmeen

router.get('/user/viewUnverifiedArticles',mw.isAuthenticated,mw.isAdmin,userCtrl.viewUnverifiedArticles);
router.get('/user/viewArticleToVerify/:articleId',mw.isAuthenticated,mw.isAdmin,userCtrl.viewArticleToVerify);
router.patch('/user/verifyArticle/:articleId',mw.isAuthenticated,mw.isAdmin,userCtrl.verifyArticle);
module.exports = router;
