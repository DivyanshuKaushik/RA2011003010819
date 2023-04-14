// dkrishna@affordmed.com
const express = require("express");
const API = require("./api");

const app = express();

// load secrets from .env file
require("dotenv").config();

function priceComparator(t1, t2) {
    if (t1.price.sleeper > t2.price.sleeper) {
        return 1;
    } else if (t1.price.sleeper < t2.price.sleeper) {
        return -1;
    } else {
        // if price of both sleeper is same then compare AC
        if (t1.price.AC > t2.price.AC) return 1;
        else return 1;
    }
}

function seatAvlComparator(t1, t2) {
    if (t1.seatsAvailable.sleeper < t2.seatsAvailable.sleeper) {
        return 1;
    } else if (t1.seatsAvailable.sleeper > t2.seatsAvailable.sleeper) {
        return -1;
    } else {
        // if price of both sleeper is same then compare AC
        if (t1.seatsAvailable.AC < t2.seatsAvailable.AC) return 1;
        else return 1;
    }
}

function departureComparator(t1, t2) {
    // sort by descending order of time
    // departure time t1
    let departure1 = new Date();
    departure1.setHours(t1.departureTime.Hours);
    departure1.setMinutes(t1.departureTime.Minutes + t1.delayedBy);
    departure1.setSeconds(t1.departureTime.Seconds);

    // departure time t2
    let departure2 = new Date();
    departure2.setHours(t2.departureTime.Hours);
    departure2.setMinutes(t2.departureTime.Minutes + t2.delayedBy);
    departure2.setSeconds(t2.departureTime.Seconds);

    if (departure1 > departure2) {
        return 1;
    }
    return -1;
}

app.get("/trains", async (req, res) => {
    try {

        const initial = (await API.get("/trains")).data;

        // ignore trains that are in next 30 minutes of departure
        const filtered = initial.filter(({ departureTime }) => {
            // departure time
            let departure = new Date();
            departure.setHours(departureTime.Hours);
            departure.setMinutes(departureTime.Minutes);
            departure.setSeconds(departureTime.Seconds);
            // current time
            const now = new Date();
            const diff = departure - now;
            return diff > 30 * 60 * 1000;
        });

        // sort by price
        filtered.sort(priceComparator);

        // sort by seats available
        filtered.sort(seatAvlComparator);
        // sort by departure time

        // let us consider delay in minutes 
        filtered.sort(departureComparator);

        return res.status(200).json(filtered);
    } catch (error) {
        console.log(error);
    }
});

app.get("/trains/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const initial = (await API.get(`/trains/${id}`)).data;
        return res.status(200).json(initial);
    } catch (error) {
        console.log(error);
    }
});


// listed to requests on port 3000
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
