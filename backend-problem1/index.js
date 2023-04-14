const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const app = express();

// parse json 
app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

// morgan setup 
app.use(morgan("dev"));

function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }
  
app.get("/numbers", async (req, res) => {
    try {
        let {url} =  req.query;

        let nums = await Promise.all(url.map(async (link) => {
            if (isValidUrl(link)) {
                try {
                    // give res in 300ms 
                    const data = await axios.get(link, {timeout: 350});
                    return data.data.numbers;
                    
                } catch (error) {
                    console.log(error);
                }
            }
        }));
        nums = nums.flat();

        // remove duplicates 
        nums = [...new Set(nums)];

        // sort in ascending order merge sort
        nums.sort((a, b) => a - b);
        return res.status(200).json(nums);
    } catch (error) {
        console.log(error);
    }
});



// listed to requests on port 3000
app.listen(4000, () => {
    console.log(`Server started on port ${4000}`);
});
