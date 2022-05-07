/* eslint-disable */
'use strict';

//tested working
const admin = require('../db');
const firebase = require("firebase-admin");
//const _ = require('lodash');
const db = admin.firestore();
const habitCollection = db.collection('habits');

const calendarCollection = db.collection('calendar');
const userCollection = db.collection('users');



module.exports.getHabits= async function(userId, callback) {
    try{ 
        const habits = await habitCollection.doc(userId).get()
        if (!habits.exists) {
            callback('No habits created for this user!', null)
        }
        else {
            const data = habits.data();
            data['userId'] = userId;
            callback(null, data)
        }
    } catch(err) {
        callback(err, null)
    }
}


module.exports.addHabit = async function(userId, updateMap, callback){
    try{
        const habits = await habitCollection.doc(userId).get();
        if(!habits.exists){
            callback('No habits created for this user!', null)
        }
        else{
            const res = await habitCollection.doc(userId).update(updateMap)
            callback(null, "Update successfully");
        }
    } catch(err) {
        callback(err, null)
    }
}

module.exports.updateHabitAmount = async function(userId, habitName, habitAmount, dateString, callback){
    try{
        const habits = await habitCollection.doc(userId).get();
        const habitsData = habits.data();

        const calendar = await calendarCollection.doc(userId).get();
        const calendarData = calendar.data();

        const user = await userCollection.doc(userId).get();
        const userData = user.data();
        //const updatedAmount = habitsData[habitName]["amount"] + habitAmount;
        
        if(!habits.exists){
            callback('No habits created for this user!', null)
        }
        else{

            if (habitsData['date'] == dateString){
                //let updateCurrentData = _.cloneDeep(habitsData)
                habitsData[habitName]["amount"] += Number(habitAmount)
                
                if (habitsData[habitName]["amount"] >= habitsData[habitName]["target"]){
                    habitsData[habitName]["progress"] = 1
                    if (dateString in calendarData) {
                        if (!calendarData[dateString].includes(habitName)){
                            userData["overallprogress"] += 1
                            if (userData["overallprogress"] < 20){
                                userData["petstage"] = "egg"
                            }
                            else if (userData["overallprogress"] >= 20 && userData["overallprogress"] < 50){
                                userData["petstage"] = "chick"
                            }
                            else if (userData["overallprogress"] >= 50){
                                userData["petstage"] = "chicken"
                                userData["overallprogress"] = 0
                            }
                            const res = await userCollection.doc(userId).update(
                                //[`${habitName}.amount`]: admin.firestore.FieldValue.increment(1)
                                userData
                            )
                            //---------------------------------------------------
                            calendarData[dateString].push(habitName)
                            const res1 = await calendarCollection.doc(userId).update(
                                //[`${habitName}.amount`]: admin.firestore.FieldValue.increment(1)
                                calendarData
                            )
                        }
                    }
                    else {
                        userData["overallprogress"] += 1
                        if (userData["overallprogress"] < 20){
                            userData["petstage"] = "egg"
                        }
                        else if (userData["overallprogress"] >= 20 && userData["overallprogress"] < 50){
                            userData["petstage"] = "chick"
                        }
                        else if (userData["overallprogress"] >= 50){
                            userData["petstage"] = "chicken"
                            userData["overallprogress"] = 0
                        }
                        const res = await userCollection.doc(userId).update(
                            //[`${habitName}.amount`]: admin.firestore.FieldValue.increment(1)
                            userData
                        )
                        //------------------------------------------------------
                        const tempHabitArray = []
                        tempHabitArray.push(habitName)
                        calendarData[dateString] = tempHabitArray
                        const res1 = await calendarCollection.doc(userId).update(
                            //[`${habitName}.amount`]: admin.firestore.FieldValue.increment(1)
                            calendarData
                        )
                    }
                }
                else {
                    const updatedProgress = habitsData[habitName]["amount"] / habitsData[habitName]['target']
                    habitsData[habitName]["progress"] = Number(updatedProgress.toFixed(3))
                }
                const res2 = await habitCollection.doc(userId).update(
                    //[`${habitName}.amount`]: admin.firestore.FieldValue.increment(1)
                    habitsData
                )
                
            }
            else{
                //do changes to the calendar database
                const calendarArray = []
                const dateName = habitsData['date']
                
                if ('drink' in habitsData) {
                    if (habitsData['drink']['target'] != 0){
                        if (habitsData['drink']['amount'] >= habitsData['drink']['target']){
                            calendarArray.push('drink')
                        }
                    }
                }
                if ('exercise' in habitsData) {
                    if (habitsData['exercise']['target'] != 0){
                        if (habitsData['exercise']['amount'] >= habitsData['exercise']['target']){
                            calendarArray.push('exercise')
                        }
                    }
                }
                if ('read' in habitsData) {
                    if (habitsData['read']['target'] != 0){
                        if (habitsData['read']['amount'] >= habitsData['read']['target']){
                            calendarArray.push('read')
                        }
                    }
                }
                if ('sleep' in habitsData) {
                    if (habitsData['sleep']['target'] != 0){
                        if (habitsData['sleep']['amount'] >= habitsData['sleep']['target']){
                            calendarArray.push('sleep')
                        }
                    }
                }
                if (calendarArray.length >= 1){
                    const unionRes = await calendarCollection.doc(userId).update({[dateName]:calendarArray})
                }
                //----------------------------------------------------------------------------
                //do changes to the habit database
                //let updateResetData = _.cloneDeep(habitsData)
                habitsData['date'] = dateString
                if ('drink' in habitsData) {
                    habitsData['drink']['amount'] = 0
                    habitsData['drink']['progress'] = 0
                }
                if ('exercise' in habitsData) {
                    habitsData['exercise']['amount'] = 0
                    habitsData['exercise']['progress'] = 0
                }
                if ('read' in habitsData) {
                    habitsData['read']['amount'] = 0
                    habitsData['read']['progress'] = 0
                }
                if ('sleep' in habitsData) {
                    habitsData['sleep']['amount'] = 0
                    habitsData['sleep']['progress'] = 0
                }

                habitsData[habitName]['amount'] = Number(habitAmount)

                if (habitsData[habitName]["amount"] >= habitsData[habitName]["target"]){
                    habitsData[habitName]["progress"] = 1
                }
                else {
                    const updatedProgress2 = habitsData[habitName]['amount'] / habitsData[habitName]['target']
                    habitsData[habitName]["progress"] = Number(updatedProgress2.toFixed(3))
                }
                const res3 = await habitCollection.doc(userId).update(
                    //[`${habitName}.progress`]: admin.firestore.FieldValue.increment(1)
                    //[`${habitsData['date']}`]
                    habitsData
                )

                //--------------------------------------------------------------------------
            }

            callback(null, "Updated successfully");
        }
    } catch(err) {
        callback(err, null)
    }
}


module.exports.updateHabitTarget = async function(userId, habitName, habitTarget, callback){
    try{
        const habits = await habitCollection.doc(userId).get();
        const habitsData = habits.data();
        if(!habits.exists){
            callback('No habits created for this user!', null)
        }
        else{
            //let updateTargetData = _.cloneDeep(habitsData)
            if (habitName == 'drink'){
                habitsData['drink']['target'] = Number(habitTarget)
                const updatedProgress = habitsData['drink']["amount"] / Number(habitTarget)
                habitsData['drink']["progress"] = Number(updatedProgress.toFixed(3))
                const res = await habitCollection.doc(userId).update(habitsData)
            }
            else if (habitName == 'exercise'){
                habitsData['exercise']['target'] = Number(habitTarget)
                const updatedProgress = habitsData['exercise']["amount"] / Number(habitTarget)
                habitsData['exercise']["progress"] = Number(updatedProgress.toFixed(3))
                const res = await habitCollection.doc(userId).update(habitsData)
            }
            else if (habitName == 'read'){
                habitsData['read']['target'] = Number(habitTarget)
                const updatedProgress = habitsData['read']["amount"] / Number(habitTarget)
                habitsData['read']["progress"] = Number(updatedProgress.toFixed(3))
                const res = await habitCollection.doc(userId).update(habitsData)
            }
            else if (habitName == 'sleep'){
                habitsData['sleep']['target'] = Number(habitTarget)
                const updatedProgress = habitsData['sleep']["amount"] / Number(habitTarget)
                habitsData['sleep']["progress"] = Number(updatedProgress.toFixed(3))
                const res = await habitCollection.doc(userId).update(habitsData)
            }
            
            callback(null, "Updated successfully");
        }
    } catch(err) {
        callback(err, null)
    }
}


module.exports.deleteHabit = async function(userId, habitName, callback){
    try{
        const habits = await habitCollection.doc(userId).get();
        if(!habits.exists){
            callback('No habits created for this user!', null)
        }
        else{
            if (habitName == 'drink'){
                const res = await habitCollection.doc(userId).update({
                    drink: firebase.firestore.FieldValue.delete()
                  })
            }
            else if (habitName == 'exercise'){
                const res = await habitCollection.doc(userId).update({
                    exercise: firebase.firestore.FieldValue.delete()
                  })
            }
            else if (habitName == 'read'){
                const res = await habitCollection.doc(userId).update({
                    read: firebase.firestore.FieldValue.delete()
                  })
            }
            else if (habitName == 'sleep'){
                const res = await habitCollection.doc(userId).update({
                    sleep: firebase.firestore.FieldValue.delete()
                  })
            }
            
            callback(null, "Deleted successfully");
        }
    } catch(err) {
        callback(err, null)
    }
}


module.exports.resetProgress = async function(userId, habitName, callback){
    try{
        const habits = await habitCollection.doc(userId).get();
        const habitsData = habits.data();

        const calendar = await calendarCollection.doc(userId).get();
        const calendarData = calendar.data();
        if(!habits.exists){
            callback('No habits created for this user!', null)
        }
        else{
            if (habitName == 'drink') {
                if ('drink' in habitsData) {
                    habitsData['drink']['amount'] = 0
                    habitsData['drink']['progress'] = 0
                }
            }
            else if (habitName == 'exercise') {
                if ('exercise' in habitsData) {
                    habitsData['exercise']['amount'] = 0
                    habitsData['exercise']['progress'] = 0
                }
            }
            else if (habitName == 'sleep') {
                if ('sleep' in habitsData) {
                    habitsData['sleep']['amount'] = 0
                    habitsData['sleep']['progress'] = 0
                }
            }
            else if (habitName == 'read') {
                if ('read' in habitsData) {
                    habitsData['read']['amount'] = 0
                    habitsData['read']['progress'] = 0
                }
            }
            //if (dateString in calendarData) {
            //    const res = await calendarCollection.doc(userId).update({
            //        dateString: firebase.firestore.FieldValue.delete()
            //      })
            //}
            const res = await habitCollection.doc(userId).update(habitsData)
            callback(null, "Update successfully");
        }
    } catch(err) {
        callback(err, null)
    }
}
