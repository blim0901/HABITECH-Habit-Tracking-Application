/* eslint-disable */

const express = require("express");
const router = express.Router();
const CalendarController = require("../controllers/calendarController");




router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    CalendarController.getCalendar(
        userId,
        (err, calData) => {
            if(err){
                return res.status(500).send({ message: `${err}`})
            }
            else{
                return res.status(200).send(calData)
            }
        }
    )
});


module.exports = router;