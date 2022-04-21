
//Asking user for their current location, output weather

// if ('geolocation' in navigator) {
//     console.log('geo avail');
//     navigator.geolocation.getCurrentPosition(async position => {
//         console.log(position.coords);
//         const lat = position.coords.latitude;
//         const lon = position.coords.longitude;
//         const api_url = `weather/${lat},${lon}`;
//         const response = await fetch(api_url);
//         const json = await response.json();
//         const daily = json.daily;
//         console.log(json);
//     });
// }
// else {
//     console.log('yikes');
// }


document.getElementById("searchButton").addEventListener("click", getWeatherDisplay);
// document.getElementById("search").addEventListener("keyup", function(event){
// if(event.key == "Enter"){
//     getWeatherDisplay; 
// }
// });
var lat = 0;
var lon = 0;


//Incredible solution to my problems from stack overflow: 
//https://stackoverflow.com/questions/14601655/google-places-autocomplete-pick-first-result-on-enter-key/21101771
//Makes the search bar select the first option when you hit enter

var selectFirstOnEnter = function (input) {  // store the original event binding function
    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;
    function addEventListenerWrapper(type, listener) {  // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected, and then trigger the original listener.
        if (type == "keydown") {
            var orig_listener = listener;
            listener = function (event) {
                var suggestion_selected = $(".pac-item-selected").length > 0;
                if (event.which == 13 && !suggestion_selected) {
                    var simulated_downarrow = $.Event("keydown", { keyCode: 40, which: 40 });
                    orig_listener.apply(input, [simulated_downarrow]);
                    console.log("down arrow");

                    //Hacky solution to wait for api call to populate lat / lng data
                    //Better to review async / await functions
                    setTimeout(function () {
                        getWeatherDisplay();
                    }, 300);
                }
                orig_listener.apply(input, [event]);

            };
        }
        _addEventListener.apply(input, [type, listener]); // add the modified listener
    }
    if (input.addEventListener) {
        input.addEventListener = addEventListenerWrapper;
    }
    else if (input.attachEvent) {
        input.attachEvent = addEventListenerWrapper;
    }
}

selectFirstOnEnter(document.getElementById("search"));

//Callback function for google places api
function activatePlacesSearch() {
    var input = document.getElementById('search');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {

        console.log("Please: " + $(".pac-container .pac-item:first").text());
        var place = autocomplete.getPlace();
        lat = place.geometry.location.lat();
        lon = place.geometry.location.lng();
    });
}





// //Search bar is responsive to 'Enter' keydown
// document.getElementById("search").addEventListener("keydown",
//     function (event) {
//         if (!event) {
//             var event = window.event;
//         }
//         event.preventDefault();
//         if (event.key === 'Enter') {
//             getWeatherDisplay();
//         }
//     }, false);



async function getWeatherDisplay() {
    $(".weatherArea").empty();
    $(".city").text("Weather in...");


    var cityName = $("#search").val();
    try {
        console.log("API call lat lon: " + lat + " " + lon);
        const api_url = `weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        const daily = await json.daily;
        console.log(daily);
        for (const element of daily) {
            const dailyTest = element;
            const dt = dailyTest.dt;
            const dateAndDayofWeek = new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: "long", day: "numeric", year: "numeric" });
            const temperature = dailyTest.temp.day;
            const main_weather = dailyTest.weather[0].main;
            const weather_icon = dailyTest.weather[0].icon;
            const windSpeed = dailyTest.wind_speed;
            const wind_deg = toTextualDescription(dailyTest.wind_deg);
            $(".city").text("Weather in " + cityName);

            var x = window.matchMedia("(max-width: 1040px)");
            if (x.matches) { // If media query matches
                document.body.style.backgroundImage =
                    "url('https://source.unsplash.com/1200x800/?" + cityName + "')";
            } else {
                document.body.style.backgroundImage =
                    "url('https://source.unsplash.com/1600x900/?" + cityName + "')";
            }
            const template =
                `<div class="weatherDay">
                    <h3 class="date">${dateAndDayofWeek}</h3>
                    <h3 class="temp">${temperature}°F</h1>
                    <div class="flex">
                        <img src="https://openweathermap.org/img/wn/${weather_icon}.png" alt="" class="icon" />
                        <div class="description">${main_weather}</div>
                    </div>
                    <div class="description">${windSpeed} mph, ${wind_deg}</div>
                </div>`;
            $(".weatherArea").append(template);
        }

    }
    catch (error) {
        if (error == "SyntaxError: Unexpected token < in JSON at position 0") {
            $(".city").text("Weather in nowhere...");
        }
    }
}


//Convert weather degrees to more descriptive text description
function toTextualDescription(degree) {
    if (degree > 337.5) return 'Northerly';
    if (degree > 292.5) return 'North Westerly';
    if (degree > 247.5) return 'Westerly';
    if (degree > 202.5) return 'South Westerly';
    if (degree > 157.5) return 'Southerly';
    if (degree > 122.5) return 'South Easterly';
    if (degree > 67.5) return 'Easterly';
    if (degree > 22.5) { return 'North Easterly'; }
    return 'Northerly';
}