const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
const { response } = require("express");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var dataToBeSent = JSON.stringify(data);

    var url = "https://us10.api.mailchimp.com/3.0/lists/cf12452bf5";
    var options = {
        method: "POST",
        auth: "leodra:5c47c9c5a919966c50df7fe3745407a5-us10"
    }

    const request = https.request(url, options, function (response) {
        console.log(response.statusCode);

        if (response.statusCode === 200)
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/failure.html");

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(dataToBeSent);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen("3000", function () {
    console.log("Listening to port 3000");
})


//Api Key: 5c47c9c5a919966c50df7fe3745407a5-us10
//List id: cf12452bf5