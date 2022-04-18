
if('geolocation' in navigator){
    console.log('geo avail');
    navigator.geolocation.getCurrentPosition(async position =>{
        console.log(position.coords);
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const api_url = `weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        const daily = json.daily;
        console.log(json);
        });
}       
else{
    console.log('yikes');
}

document.getElementById("searchButton").addEventListener("click", async function() {
        var cityName = document.getElementById("search").value;
        const geo_url = `/city/${cityName}`;
        const geo_response = await fetch(geo_url);
        const geo_json = await geo_response.json();
        //alert(geo_json[0].name);
        // $.each(geo_json, function(key,value) {
        //     alert(key + " " + value.name + ", " + value.state + " coords: " + value.lat + ", " + value.lon);
        // });
        cityName =  geo_json[0].name;
        cityState = geo_json[0].state;
        const lat = geo_json[0].lat;
        const lon = geo_json[0].lon;
        const api_url = `weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        const daily = json.daily;
        const dailyTest = daily[0];
        const dt = dailyTest.dt;
        const dateAndDayofWeek = new Date(dt*1000).toLocaleDateString('en-US', {weekday:'long', month:"long", day:"numeric", year:"numeric"});
        console.log(dateAndDayofWeek);
        const temperature = dailyTest.temp.day;
        //console.log(dailyTest);
        const main_weather = dailyTest.weather[0].main;
        const weather_icon = dailyTest.weather[0].icon;
        const windSpeed = dailyTest.wind_speed;
        const wind_deg = toTextualDescription(dailyTest.wind_deg);
        console.log(cityName +", " +  cityState + "\n" + dateAndDayofWeek + "\n" + temperature + "°, " + main_weather + "\n" +  weather_icon  + "\n" + windSpeed + " mph, " + wind_deg);
        //console.log(geo_json);
  });

  function  toTextualDescription(degree){
    if (degree>337.5) return 'Northerly';
    if (degree>292.5) return 'North Westerly';
    if(degree>247.5) return 'Westerly';
    if(degree>202.5) return 'South Westerly';
    if(degree>157.5) return 'Southerly';
    if(degree>122.5) return 'South Easterly';
    if(degree>67.5) return 'Easterly';
    if(degree>22.5){return 'North Easterly';}
    return 'Northerly';
}



        