var multer = require('multer');
var storage = multer.diskStorage({
    destination: 'public/images/profile/',
    filename: function(req, file, cb){
        cb(null, req.session.user_id+'.'+file.originalname.split('.').pop());
    }
});
var upload = multer({ storage: storage });

var userCtrl = require('../controllers/userCtrl');
var familyCtrl = require('../controllers/familyCtrl');
var callCtrl = require('../controllers/callCtrl');
var friendCtrl = require('../controllers/friendCtrl');
var friendshipCtrl = require('../controllers/friendshipCtrl');
var socialWorkerCtrl = require('../controllers/socialWorkerCtrl');

exports.initApp = function(app){

    /***        WEB         ***/
    app.route('/')
        .get(userCtrl.isLoginWeb, userCtrl.main);

    app.route('/user/login')
        .get(userCtrl.loginForm)
        .post(userCtrl.loginWeb);

    app.route('/user/logout')
        .get(userCtrl.isLoginWeb, userCtrl.logoutWeb);

    app.route('/user/join')
        .get(userCtrl.joinForm)
        .post(userCtrl.joinWeb);

    app.route('/call/:receiver')
        .get(userCtrl.isLoginWeb, socialWorkerCtrl.call)
        .post(userCtrl.isLoginWeb, socialWorkerCtrl.call2);

    app.route('/callee')
        .get(userCtrl.isLoginWeb, socialWorkerCtrl.callee);


    app.route('/senior')
        .get(userCtrl.isLoginWeb, socialWorkerCtrl.getSeniorList)
        .post(userCtrl.isLoginWeb, socialWorkerCtrl.addSenior)
        .delete(userCtrl.isLoginWeb, socialWorkerCtrl.deleteSenior);

    app.route('/senior/add')
        .get(userCtrl.isLoginWeb, socialWorkerCtrl.getSeniorAddForm);

    app.route('/senior/:user_id')
        .get(userCtrl.isLoginWeb, socialWorkerCtrl.getSeniorDetails)
        .post(userCtrl.isLoginWeb, socialWorkerCtrl.addSeniorNeibors)
        .delete(userCtrl.isLoginWeb, socialWorkerCtrl.deleteSeniorNeibors);

    app.route('/project')
        .get(userCtrl.isLoginWeb, socialWorkerCtrl.getSeniorProjectList)
        .post(userCtrl.isLoginWeb, socialWorkerCtrl.addSeniorProject)
        .delete(userCtrl.isLoginWeb, socialWorkerCtrl.deleteSeniorProject);

    /***        Mobile      ***/
    app.route('/mobile/user')
        .get(userCtrl.isLogin, userCtrl.logout)
        .post(userCtrl.login)
        .put(userCtrl.join);

    app.route('/mobile/user/mypage')
        .get(userCtrl.isLogin, userCtrl.getMyInfo)
        .post(userCtrl.isLogin, upload.single('profile'), userCtrl.uploadProfile);

    app.route('/mobile/call')
        .post(userCtrl.isLogin, callCtrl.call);

    app.route('/mobile/family/:page_num')
        .get(userCtrl.isLogin, familyCtrl.getList);

    app.route('/mobile/friends/:page_num')
        .get(userCtrl.isLogin, friendCtrl.getList);

    app.route('/mobile/friendship/:page_num')
        .get(userCtrl.isLogin, friendshipCtrl.getList);
}