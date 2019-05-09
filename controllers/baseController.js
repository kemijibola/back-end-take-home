const halson = require('halson');
const { ERROR_CODES } = require('../lib/contants');
const mongoose = require('mongoose');
const helpers = require('../lib/helpers');

class BaseController {
    constructor(){
    }
    transformResponse(res, status, data, message){
        if (!status){
            if(ERROR_CODES[data]){
                return res.status(ERROR_CODES[data]).json({
                    status: status,
                    error: {
                        type: data,
                        message: message
                    },
                    data: {}
                })
            }else {
                return res.status(400).json({
                    status: status,
                    error: {
                        type: data,
                        message: message
                    },
                    data: {}
                })
            }
        }
        return res.json({
            status: status,
            message: message,
            data: data
        })
    }

    writeHAL(obj){
        if(Array.isArray(obj)){
            let newArr = obj.map(item => {
                if (typeof(item._id) === 'string'){
                    item._id = mongoose.Types.ObjectId(item._id);
                    let json = JSON.stringify(item)               
                    return helpers.makeHAL(json);  
                }
                return item.toHAL();
            });
            obj = halson(newArr);
        }else {
            if (obj && obj.toHAL){
                obj = obj.toHAL();
            }
        }
        if (!obj){
             obj = {}
        }
        return obj;
    }
}

module.exports = BaseController;