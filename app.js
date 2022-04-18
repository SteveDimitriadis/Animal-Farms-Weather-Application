const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.listen(3000, () => console.log("listening at 3000...."));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json({limit: '1mb'}));
app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = '94a83aa608751b129542eb8e4829206c';
    const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${api_key}`;
    const weather_response = await fetch(api_url);
    const json = await weather_response.json();
    response.json(json);
});
app.get('/city/:cityName', async (request, response) => {
    console.log(request.params);
    const cityName = request.params.cityName;
    const api_key = '94a83aa608751b129542eb8e4829206c';
    const api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${api_key}`;
    const geo_response = await fetch(api_url);
    const json = await geo_response.json();
    response.json(json);
});
