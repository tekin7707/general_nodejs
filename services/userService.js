const express = require('express');
const jwt = require('jwt-simple');
const datetime = require('node-datetime');
const nodemailer = require('nodemailer');
var User = require('../models/userModel');
var router = express.Router();

module.exports = { router };

var user = {
    router, checkAuthenticated: (req, res, next) => {
        if (req.header('authorization')) {
            try {
                token = req.header('authorization').split(' ')[1];
                var payload = jwt.decode(token, '12345');
                if (payload) {
                    req._id = payload._id;
                    next();
                }
                else res.send({ status: 401, message: 'invalid token' });
            } catch (error) {
                res.send({ status: 401, message: 'invalid token' });
            }
        }
        else res.send({ status: 401, message: 'No Autharization Header' });
    }
}

router.get('/test', (req, res) => {
    console.log('Sending Mail');
    sendMailMethod('hukumsuren@gmail.com', 'testtttt').then((data, error) => {
        if (error) {
            return res.send({ status: 403, data: null, message: error });
        } else {
            console.log('Sended.');
            return res.send(data);
        }
    });
});

createUniqeCode = () => {
    return 'KVWDIRTNGv2wjheufje786247' + datetime.create().format('dmHMS') + '81343fjdvnowuefDGDGvrgmkmkwef' + datetime.create().format('YmdHMS') + 'KDnf234F5ggh923';
};

sendMailMethod = async (email, ac) => {
    return await sendMail(email, ac);
}

sendMail = async (email, ac) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tekin7707@gmail.com',
                pass: 'Mt777777'
            }
        });
        var mailOptions = {
            from: 'tekin7707@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            html: '<h1>Welcome to Your Sense !</h1><p>Click to link for</p><a href="http://localhost:5001/user/activate/?activateCode=' + ac + '">activate >>></a>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject({ status: 404, data: null, message: error });
            } else {
                resolve({ status: 200, data: null, message: info.response });
            }
        });
    });
}

router.post('/register', (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    user._id = null;
    user.activateCode = createUniqeCode();
    console.log(user);
    user.save((error, result) => {
        if (error) {
            console.log('Error post');
            console.log(error);
            return res.send({ status: 401, data: user, message: error });
        } else {
            console.log('Success post');
            sending_mail = '';
            console.log('Sending Mail');
            sendMailMethod(user.email, user.activateCode).then((data, error) => {
                if (error) {
                    sending_mail = 'Error :' + error.message;
                } else {
                    sending_mail = '(Email Sended.)';
                }
                return res.send({ status: 201, data: user, message: 'Created' + sending_mail });
            });
        }
    });
});

router.delete('/delete', async (req, res) => {

    var userData = req.body;
    console.log(userData);

    var user = await User.find({ email: userData.email });
    console.log(user);

    User.remove({ _id: userData._id }, (error, result) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500).send({ message: error });
        } else {
            console.log('Success delete');
            return res.sendStatus(200);
        }
    });
});

router.post('/add', async (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    user.save((error, result) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500).send({ message: error });
        } else {
            console.log('Success post');
            return res.sendStatus(201);
        }
    });
});

router.post('/update', (req, res) => {
    var userData = req.body;
    User.findById(userData._id, (error, data) => {
        if (error) {
            console.log(error);
            return res.send({ status: 401, data: null, message: 'Record not found' });
        }
        data.update({ firstName: userData.firstName, lastName: userData.lastName }, (error, result) => {
            if (error) {
                console.log(error);
                return res.send({ status: 401, data: null, message: error });
            } else {
                return res.send({ status: 200, data: data, message: 'Updated' });
            }
        });
    });
});

router.get('/get', async (req, res) => {
    var users = await User.find({});
    res.send(users);
});

router.post('/login', async (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    User.findOne({ email: user.email, password: user.password }).then(x => {
        let r = x ? { status: 200, message: '', data: x } : { status: 403, message: 'Email or Password not match' };
        console.log(r);
        if (r.status == 200) {
            let payload = { _id: x._id };//token decode edince _id değerini almak için ekledik
            x.token = jwt.encode(payload, '12345');
            r.data = x;
            console.log(r);
        }
        return res.send(r);
    });
});

//eksik
router.post('/checkPassword', user.checkAuthenticated, async (req, res) => {
    console.log('req._id :%s', req._id);
    var userData = req.body;
    User.findOne({ _id: req._id, password: userData.password }).then(x => {
        let r = x ? { status: 200, message: '', data: x } : { status: 403, message: 'Password not match' };
        console.log(r);
        if (r.status == 200) {
            r.data = 'OK';
            console.log(r);
        }
        return res.send(r);
    });
});

router.post('/updatePassword', user.checkAuthenticated, async (req, res) => {
    console.log('req._id :%s', req._id);
    var userData = req.body;
    console.log('userData.oldPassword :%s', userData.oldPassword);
    console.log('userData.newPassword :%s', userData.newPassword);
    // , oldPassword: userData.oldPassword, newPassword: userData.newPassword
    User.findOne({ _id: req._id }).then(x => {
        let r = x ? { status: 200, message: '', data: x } : { status: 403, message: 'User not found' };
        console.log(r);
        if (r.status == 200) {
            console.log('1');
            if (x.password == userData.oldPassword) {
                console.log('2');

                x.update({ password: userData.newPassword }, (error, result) => {
                    if (error) {
                        console.log('3');
                        console.log(error);
                        return res.send({ status: 401, data: null, message: error });
                    } else {
                        console.log('4');
                        return res.send({ status: 200, data: null, message: 'Password Updated' });
                    }
                });
            }
            else {
                console.log('5');
                let r = { status: 403, message: 'Password not match' };
                return res.send(r);
            }
        }
        else {
            console.log('6');
            return res.send(r);
        }
    });
});

router.get('/getAll', user.checkAuthenticated, async (req, res) => {
    console.log('user: %s', req._id);
    var users = await User.find({});
    res.send(users);
});

router.get('/activate', async (req, res) => {
    console.log('req.query : %s', req.query.activateCode);
    s = req.query.activateCode ? req.query.activateCode : '';
    User.findOne({ activateCode: s }).then(x => {
        let r = x ? { status: 200, message: '', data: x } : { status: 403, message: 'User Not Found' };
        console.log(r);
        if (r.status == 200) {
            if (x.activateCode == s) {
                var dt = datetime.create();
                var formatted = dt.format('Y-m-d H:M:S');
                console.log(formatted);
                x.update({ activateCode: formatted, status: 1 }, (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.send({ status: 401, data: null, message: error });
                    } else {

                        return res.send({ status: 200, data: null, message: 'Account Activated  <a href="http://localhost:4200">click for site >>></a>' });
                    }
                });
            } else {
                return res.send({ status: 403, message: 'Activation Code is expired!' });
            }
        }
        else {
            return res.send(r);
        }
    });
});

router.get('/sendActivationCode', async (req, res) => {
    console.log('req.query._id : %s', req.query._id);
    User.findOne({ _id: req.query._id }).then(x => {
        let r = x ? { status: 200, message: '', data: x } : { status: 403, message: 'User Not Found' };
        // console.log(r);
        if (r.status == 200) {
            if(x.status>0) return res.send({ status: 200, message: 'Account already activated. Try password remember.', data: null });
            _code = createUniqeCode();
            x.update({ activateCode: _code, status: 0 }, (error, result) => {
                console.log("update ok");
                if (error) {
                    console.log(error);
                    return res.send({ status: 401, data: null, message: error });
                } else {
                    sending_mail = '';
                    console.log('Sending Mail');
                    sendMailMethod(user.email, user.activateCode)
                    .then((data, error) => {
                        if (error) {
                            sending_mail = 'Error :' + error.message;
                        } else {
                            sending_mail = '(Email Sended.)';
                        }
                        return res.send({ status: 201, data: user, message: 'Created' + sending_mail });
                    });
                }
            });
        }
        else {
            return res.send(r);
        }
    });
});


