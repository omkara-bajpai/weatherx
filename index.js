// Todo : make bodyparser working, post request , api fetch , use operators to show and hide weather cards
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var app = express();
const port = 5000;
var hbs = exphbs.create({});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.render("home");
});
app.post("/", async function (req, res) {
    city = req.body.city;
    try {
        const response = await fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=API_KEY`
        );
        const response_json = await response.json();
        if (response_json["message"] == "city not found") {
            res.render("home", { result: true, wrong: true });
        } else {
            let weather_img = `http://openweathermap.org/img/w/${response_json["weather"][0]["icon"]}.png`;
            res.render("home", {
                temp: response_json["main"]["temp"],
                min: response_json["main"]["temp_min"],
                max: response_json["main"]["temp_max"],
                feels_like: response_json["main"]["feels_like"],
                name: response_json["name"],
                country: response_json["sys"]["country"],
                result: true,
                desc: response_json["weather"][0]["main"],
                weather_img: weather_img,
            });
        }
    } catch {
        res.render("home", { result: true, error: true });
    }
});

app.listen(port, () => {
    console.log(`WeatherX is live on http://localhost:${port}`);
});
