var multer = require('multer');
var storage = multer.diskStorage({
    destination: 'public/images/profile/',
    filename: function(req, file, cb){
        cb(null, req.session.user_id+'.'+file.originalname.split('.').pop());
    }
});
var upload = multer({ storage: storage });

var userCtrl = require('../controllers/mobile/userCtrl');
var familyCtrl = require('../controllers/mobile/familyCtrl');
var callCtrl = require('../controllers/mobile/callCtrl');
var friendCtrl = require('../controllers/mobile/friendCtrl');
var friendshipCtrl = require('../controllers/mobile/friendshipCtrl');

exports.initApp = function(app){

    /***        WEB         ***/

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