const express = require("express");
const API = require("./api");

const app = express();
// dkrishna@affordmed.com
// load secrets from .env file
require("dotenv").config();
console.log(new Date().getHours())

function priceComparator(t1,t2){
    
    if(t1.price.sleeper > t2.price.sleeper){
        return 1;
    }else if(t1.price.sleeper < t2.price.sleeper){
        return -1;
    }else{
        // if price of both sleeper is same then compare AC 
        if(t1.price.AC > t2.price.AC) return 1;
        else return 1;
    }
    // if(t1.departureTime.Hours > t2.departureTime.Hours){
    //     return 1;
    // }else if(t1.departureTime.Hours < t2.departureTime.Hours){
    //     return -1;
    // }else{
    //     if(t1.departureTime.Minutes > t2.departureTime.Minutes){
    //         return 1;
    //     }else if(t1.departureTime.Minutes < t2.departureTime.Minutes){
    //         return -1;
    //     }else{
    //         if(t1.departureTime.Seconds > t2.departureTime.Seconds){
    //             return 1;
    //         }else if(t1.departureTime.Seconds < t2.departureTime.Seconds){
    //             return -1;
    //         }else{
    //             return 0;
    //         }
    //     }
    // }
}

function seatAvlComparator(t1,t2){
    if(t1.seatsAvailable.sleeper < t2.seatsAvailable.sleeper){
        return 1;
    }else if(t1.seatsAvailable.sleeper > t2.seatsAvailable.sleeper){
        return -1;
    }else{
        // if price of both sleeper is same then compare AC 
        if(t1.seatsAvailable.AC < t2.seatsAvailable.AC) return 1;
        else return 1;
    }
}

app.get("/trains", async(req, res) => {
    try {

        const initial  =(await API.get("/trains")).data;

        // ignore trains that are in next 30 minutes of departure 
        const filtered = initial.filter(({departureTime}) => {
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

        // sort the trains by departure time , asc prices and dsc tickets 
        // sort by price 
        filtered.sort(priceComparator);
        // sort by seats available
        filtered.sort(seatAvlComparator);

        return res.status(200).json(filtered)
    } catch (error) {
        console.log(error);
    }
});

// listed to requests on port 3000
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
