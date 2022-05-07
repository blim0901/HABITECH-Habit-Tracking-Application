/* eslint-disable */

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");


router.get('/getpet/:userId', (req, res) => {
    const { userId } = req.params;
    UserController.getPetStage(
        userId,
        (err, petStage) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(petStage)
            }
        }
    )
});

router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    UserController.getUser(
        userId,
        (err, userData) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(userData)
            }
        }
    )
});


router.post('/updateprofile/:userId', (req, res) => {
    const { userId } = req.params;
    const { name, age, height, weight } = req.body;

    const updateMap = {}
    if(name != null) updateMap['name'] = name;
    if(age != null) updateMap['age'] = age;
    if(height != null) updateMap['height'] = height;
    if(weight != null) updateMap['weight'] = weight;
    
    UserController.updateUserProfile(
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


module.exports = router;