const express = require("express");
const API = require("./api");

const app = express();

// load secrets from .env file
require("dotenv").config();
console.log(new Date().getHours())

app.get("/trains", async(req, res) => {
    try {

        const initial  =(await API.get("/trains")).data;

        // ignore trains that are in next 30 minutes of departure 
        const filteredByTime = initial.filter(({departureTime}) => {
            // departure time 
            let departure = new Date()
            departure.setHours(departureTime.Hours)
            departure.setMinutes(departureTime.Minutes)
            departure.setSeconds(departureTime.Seconds)
            // current time 
            const now = new Date();
            const diff = departure - now;
            return diff > 30 * 60 * 1000;
        });

        return res.status(200).json(filteredByTime)
    } catch (error) {
        console.log(error);
    }
});

// listed to requests on port 3000
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
