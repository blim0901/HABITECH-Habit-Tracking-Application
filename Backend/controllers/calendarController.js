/* eslint-disable */
'use strict';

//tested working
const admin = require('../db');
const db = admin.firestore();
const calendarCollection = db.collection('calendar');



module.exports.getCalendar= async function(userId, callback) {
    try{ 
        const calendar = await calendarCollection.doc(userId).get()
        if (!calendar.exists) {
            callback('No calendar found for user', null)
        }
        else {
            const data = calendar.data();
            data['userId'] = userId;
            callback(null, data)
        }
    } catch(err) {
        callback(err, null)
    }
}
