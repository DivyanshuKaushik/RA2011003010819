const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const app = express();

// parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

function merge(left, right) {
    let arr = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            arr.push(left.shift());
        } else {
            arr.push(right.shift());
        }
    }
    return [...arr, ...left, ...right];
}
function mergeSort(arr) {
    const half = arr.length / 2;

    if (arr.length < 2) {
        return arr;
    }

    const left = arr.splice(0, half);
    return merge(mergeSort(left), mergeSort(arr));
}
app.get("/numbers", async (req, res) => {
    try {
        let { url } = req.query;

        let nums = await Promise.all(
            url.map(async (link) => {
                if (isValidUrl(link)) {
                    try {
                        // give res in 300ms
                        const data = await axios.get(link, { timeout: 350 });
                        return data.data.numbers;
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        );
        nums = nums.flat();

        // remove duplicates
        nums = [...new Set(nums)];

        // sort in ascending order merge sort
        nums = mergeSort(nums);
        return res.status(200).json(nums);
    } catch (error) {
        console.log(error);
    }
});

// listed to requests on port 3000
app.listen(4000, () => {
    console.log(`Server started on port ${4000}`);
});
