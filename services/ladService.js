const express = require('express');
const jwt = require('jwt-simple');
var Lad = require('../models/ladModel');
var LadItem = require('../models/ladItemModel');
var router = express.Router();

module.exports = { router };

var lad = {
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

/*
1-addLad
2-deleteLad
3-updateLad
4-getLad
4-getAllLads

-
addItem
deleteItem
updateItem
getItem
getAllItems

-
addAction
deleteAction
updateAction
getAction
getAllActions

*/

router.post('/addLad', lad.checkAuthenticated, (req, res) => {
    var ladData = req.body;
    var lad = new Lad(ladData);
    lad.save((error, result) => {
        if (error) {
            return res.send({ status: 404, data: lad, message: error });
        } else {
            return res.send({ status: 201, data: lad, message: 'Created' });
        }
    });
});

router.post('/addLadItem', lad.checkAuthenticated, (req, res) => {
    var ladItemData = req.body;
    var ladItem = new LadItem(ladItemData);
    console.log('ladItem.masterId:%s',ladItem.masterId);
    Lad.findById(ladItem.masterId, (error, data) => {
        if (error) {
            return res.send({ status: 401, data: null, message: error });
        } else {
            if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
            ladItem.save((error, result) => {
                if (error) {
                    return res.send({ status: 404, data: null, message: error });
                } else {
                    return res.send({ status: 201, data: ladItem, message: 'Created' });
                }
            });
        }
    });
});

router.delete('/deleteLad', lad.checkAuthenticated, async (req, res) => {
    var ladData = req.body;
    Lad.findById(ladData._id, (error, data) => {
        if (error) {
            return res.send({ status: 404, data: null, message: error });
        } else {
            if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
            if (data.userId != req._id) {
                console.log('Forbidden');
                return res.send({ status: 403, data: null, message: 'Forbidden' });
            }            
            /*delete detail records */
            LadItem.remove({masterId:data._id},(error, result) => {
                if (error) {
                    return res.send({ status: 404, data: null, message: error });
                } else {
                    console.log('details deleted');
                }
            });
            data.remove((error, result) => {
                if (error) {
                    return res.send({ status: 404, data: null, message: error });
                } else {
                    return res.send({ status: 200, data: null, message: 'LadItem Deleted' });
                }
            });
        }
    });
});

router.delete('/deleteLadItem', lad.checkAuthenticated, async (req, res) => {
    var ladItemData = req.body;
    LadItem.findById(ladItemData._id, (error, data) => {
        if (error) {
            return res.send({ status: 404, data: null, message: error });
        } else {
            if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
            data.remove((error, result) => {
                if (error) {
                    return res.send({ status: 404, data: null, message: error });
                } else {
                    return res.send({ status: 200, data: null, message: 'LadItem Deleted' });
                }
            });
        }
    });
});

router.post('/updateLad', lad.checkAuthenticated, (req, res) => {
    var ladData = req.body;
    console.log(ladData);
    Lad.findById(ladData._id, (error, data) => {
        if (error) {
            return res.send({ status: 404, data: null, message: error });
        } else {
            if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
            data.name = ladData.name;
            data.caption = ladData.caption;
            data.ladValue = ladData.ladValue;
            data.oneLadMin = ladData.oneLadMin;
            data.oneLadMax = ladData.oneLadMax;
            data.startDate = ladData.startDate;
            data.endDate = ladData.endDate;
            data.updateOne((error, result) => {
                if (error) {
                    return res.send({ status: 404, data: null, message: error });
                } else {
                    return res.send({ status: 200, data: data, message: 'Lad Updated' });
                }
            });
        }
    });
});

router.post('/updateLadItem', lad.checkAuthenticated, (req, res) => {
    var ladItemData = req.body;
    LadItem.findById(ladItemData._id, (error, data) => {
        if (error) {
            return res.send({ status: 404, data: null, message: error });
        } else {
            if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
            data.name= ladItemData.name;
            data.caption= ladItemData.caption;
            data.rate=ladItemData.rate;
            data.updateOne((error, result) => {
                if (error) {
                    return res.send({ status: 404, data: null, message: error });
                } else {
                    return res.send({ status: 200, data: data, message: 'LadItem Updated' });
                }
            });
        }
    });
});

router.get('/getLad', lad.checkAuthenticated, async (req, res) => {
    console.log('req.query : %s', req.query._id);//http://localhost:5001/lad/getLad/?_id=5c33565c4e09e00e880897f7
    var ladData = req.body;//{"_id": "5c33565c4e09e00e880897f7"}
    console.log('req.body :%s', ladData._id);
    Lad.findById(ladData._id, (error, data) => {
        if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
        if (error) {
            console.log(error);
            return res.send({ status: 404, data: null, message: error });
        } else if (data.userId != req._id) {
            console.log('Forbidden');
            return res.send({ status: 403, data: null, message: 'Forbidden' });
        }
        else {
            console.log(data);
            return res.send({ status: 200, data: data, message: 'Lad getLad' });
        }
    });
});

router.get('/getLadItem', lad.checkAuthenticated, async (req, res) => {
    var ladItemData = req.body;//{"_id": "5c33565c4e09e00e880897f7"}
    LadItem.findById(ladItemData._id, (error, data) => {
        if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
        if (error) {
            console.log(error);
            return res.send({ status: 404, data: null, message: error });
        } 
        else {
            console.log(data);
            return res.send({ status: 200, data: data, message: 'getLadItem' });
        }
    });
});

router.get('/getAllLads', lad.checkAuthenticated, async (req, res) => {
    console.log('req._id :%s',req._id);
    Lad.find({userId: req._id}, (error, data) => {
        if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
        if (error) {
            console.log(error);
            return res.send({ status: 404, data: null, message: error });
        } else {
            return res.send({ status: 200, data: data, message: 'Listed' });
        }
    });
});

router.get('/getAllLadItems', lad.checkAuthenticated, async (req, res) => {
    var ladItemData = req.body;//{"_id": "5c33565c4e09e00e880897f7"}
    console.log('ladItemData.masterId :%s',ladItemData.masterId);
    
    LadItem.find({masterId: ladItemData.masterId}, (error, data) => {
        if (error) {
            console.log(error);
            return res.send({ status: 404, data: null, message: error });
        } else {
            if(!data) return res.send({ status: 204, data: null, message: {message:'Record Not Found'} }); 
            return res.send({ status: 200, data: data, message: 'Listed' });
        }
    });
});

