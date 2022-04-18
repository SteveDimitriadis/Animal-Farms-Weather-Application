
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
        const cityName = document.getElementById("search").value;
        const geo_url = `/city/${cityName}`;
        const geo_response = await fetch(geo_url);
        const geo_json = await geo_response.json();
        $.each(geo_json, function(key,value) {
            alert(key + " " + value.name + ", " + value.state);
        }); 
        console.log(geo_json);
  });




        