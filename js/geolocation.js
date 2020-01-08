$(document).ready(function() {
    //  Start by grabbing the GPS location
    tryGPS();

    //  Check to see if there is any values for the lat and long
    setTimeout(function(){
        var lat = parseFloat(document.getElementById('locationLat').innerHTML);
        var lon = parseFloat(document.getElementById('locationLon').innerHTML);
        //  Uncomment below to set a manual lat/lon
        lat = 47.6036;
        lon = -122.3294;
        //  Check to see if they exist, if not fill with a default. Orlando in this case.
        if(lat === "" || lon === ""){
            lat = 28;
            lon = -81;
        }

        //  Build a URL for the call
        var getURL = 'pulldata.php?lat=' + lat + '&lon=' + lon;

        
        //  Begin the calls
        $.ajax({ 
            type: 'GET', 
            url: getURL, 
            data: {variable: 'value'}, 
            dataType: 'json',
            success: function(data) {
                //  If status = 1 then its a go.
                if(data.status == 1) {
            
                    weatherLoc = data.city + ', ' + data.state;
                    weatherTemp = data.temp;
                    weatherCity = data.city;
                    weatherState = data.state;

                    //  Display weather data
                    document.getElementById("displayLocation").innerHTML = weatherLoc;
                    document.getElementById("displayTemp").innerHTML = weatherTemp;
                    document.getElementById("locationCity").innerHTML = weatherCity;
                    document.getElementById("locationState").innerHTML = weatherState;

                    //  Display icons
                    tod = nightOrDay(data.sunrise, data.sunset);
                    weatherIconClass = weatherIcon(data.icon, tod);

                    var weatherIconHTML = document.getElementById("weatherIcon");
                    weatherIconHTML.classList.add(weatherIconClass);
                }
            }
        });
        




    }, 300);
    
});


function tryGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(printLatLon, gpsBad);
    } else {
        printError('Browser cannot support GPS location.')
    }

    return 0;
}
function printLatLon(position) {
    document.getElementById('locationLat').innerHTML = position.coords.latitude;
    document.getElementById('locationLon').innerHTML = position.coords.longitude;
    document.getElementById('locationStatus').innerHTML = 'We got your position!';
}
function gpsBad(error) {
    printError(error.message);
}
function printError(message) {
    document.getElementById('locationStatus').innerHTML = 'We could not get your position.';
    document.getElementById('locationError').innerHTML = message;
}
function nightOrDay(sunrise, sunset) {
    var currentTime = new Date();
    sunrise = new Date(sunrise);
    sunset = new Date(sunset);
    if(currentTime > sunrise && currentTime < sunset) {
        return 'day';
    } else {
        return 'night';
    }
}
function weatherIcon(code, tod) {
    var iconClass = 'wi-owm-' + tod + '-' + code; 
    return iconClass;
}