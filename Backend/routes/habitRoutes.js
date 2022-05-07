/* eslint-disable */

const express = require("express");
const router = express.Router();
const HabitController = require("../controllers/habitController");



router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    HabitController.getHabits(
        userId,
        (err, habitData) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(habitData)
            }
        }
    )
});


router.post('/addhabit/:userId', (req, res) => {
    const { userId } = req.params;
    const { habitName } = req.body;

    const updateMap = {}
    if(habitName != null) updateMap[habitName] = {
                                                    progress: 0,
                                                    target: 0,
                                                    amount:0
                                                };
    
    HabitController.addHabit(
        userId,
        updateMap, 
        (err, userId) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(userId)
            }
        }
    )
});

router.post('/updateamount/:userId', (req, res) => {
    const { userId } = req.params;
    const { habitName, habitAmount } = req.body;

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let dateString = year + "-" + month + "-" + date;
    
    HabitController.updateHabitAmount(
        userId,
        habitName, 
        habitAmount,
        dateString,
        (err, userId) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(userId)
            }
        }
    )
});


router.post('/updatetarget/:userId', (req, res) => {
    const { userId } = req.params;
    const { habitName, habitTarget } = req.body;
    
    HabitController.updateHabitTarget(
        userId,
        habitName,
        habitTarget, 
        (err, userId) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(userId)
            }
        }
    )
});


router.post('/deletehabit/:userId', (req, res) => {
    const { userId } = req.params;
    const { habitName } = req.body;
    
    HabitController.deleteHabit(
        userId,
        habitName,
        (err, userId) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(userId)
            }
        }
    )
});


router.post('/resetprogress/:userId', (req, res) => {
    const { userId } = req.params;
    const { habitName } = req.body;
    
    HabitController.resetProgress(
        userId,
        habitName,
        (err, userId) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(userId)
            }
        }
    )
});


module.exports = router;
