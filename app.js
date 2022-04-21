const express = require('express');
const fetch = require('node-fetch');
require ('dotenv').config();

const app = express();
app.listen(3000, () => console.log("listening at 3000...."));

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json({limit: '1mb'}));


//Proxy call to openweathermap to retrieve 
app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${api_key}`;
    const weather_response = await fetch(api_url);
    const json = await weather_response.json();
    response.json(json);
});

//Replaced with google places library call
app.get('/city/:cityName', async (request, response) => {
    console.log(request.params);
    const cityName = request.params.cityName;
    const geo_api_key = process.env.API_KEY;
    const api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${geo_api_key}`;
    const geo_response = await fetch(api_url);
    const json = await geo_response.json();
    response.json(json);
});
