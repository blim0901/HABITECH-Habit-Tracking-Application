/* eslint-disable */
'use strict';

const admin = require('../db');
const db = admin.firestore();
const userCollection = db.collection('users');


module.exports.getPetStage = async function(userId, callback){
    try{
        const user = await userCollection.doc(userId).get();
        
        if(!user.exists){
            callback('User does not exist', null)
        }
        else{
            const res = []
            const data = user.data();
            res.push(data['petstage']);
            res.push(userId);
            callback(null, res);
        }
    } catch(err) {
        callback(err, null)
    }
}


module.exports.getUser= async function(userId, callback) {
    try{ 
        const user = await userCollection.doc(userId).get()
        if (!user.exists) {
            callback('User does not exist', null)
        }
        else {
            const data = user.data();
            data['userId'] = userId;
            callback(null, data)
        }
    } catch(err) {
        callback(err, null)
    }
}


module.exports.updateUserProfile = async function(userId, updateMap, callback){
    try{
        const user = await userCollection.doc(userId).get();
        if(!user.exists){
            callback('User does not exist', null)
        }
        else{
            const res = await userCollection.doc(userId).update(updateMap)
            callback(null, "Updated successfully");
        }
    } catch(err) {
        callback(err, null)
    }
}