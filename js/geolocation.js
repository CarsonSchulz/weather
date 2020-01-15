$(document).ready(function($) {
    //  Start by grabbing the GPS location
    tryGPS(function(lat_lng){
        document.getElementById('locationLat').innerHTML = lat_lng.lat;
        document.getElementById('locationLon').innerHTML = lat_lng.lng;
    });

    setTimeout(function() {

        //  Get lat and lon values
        var lat = document.getElementById('locationLat').innerHTML;
        var lon = document.getElementById('locationLon').innerHTML;

        //  Uncomment below to set a manual lat/lon
        // lat = 32.2714;
        // lon = -90.2225;

        if(checkCoords(lat, lon)){
            getWeather(lat, lon);
            goodLoc();
            $('#locationModal').modal('hide');
        } else {
            getWeather(28.505204, -81.335654);
            badLoc();
            printError('There was an issue locating the given coordinates.');
        }




    }, 1000);

    //  Refresh every 5 mins
    setTimeout(function() { location.reload(); }, 300000);
    
});

function getWeather(funLat, funLon) {

    var getURL = 'pulldata.php?lat=' + funLat + '&lon=' + funLon;

    //  Begin the calls
    jQuery.ajax({
        type: 'GET',
        url: getURL,
        data: {variable: 'value'},
        dataType: 'json',
    }).done(function(data){
            if(data.status === 1) {

                weatherLoc = data.city + ', ' + data.state;
                weatherTemp = data.temp;
                weatherCity = data.city;
                weatherState = data.state;

                document.getElementById("displayLocation").innerHTML = weatherLoc;
                document.getElementById("displayTemp").innerHTML = weatherTemp;
                document.getElementById("locationCity").innerHTML = weatherCity;
                document.getElementById("locationState").innerHTML = weatherState;
                document.getElementById("locationLat").innerHTML = funLat;
                document.getElementById("locationLon").innerHTML = funLon;

                //  Display icons
                tod = nightOrDay(data.sunrise, data.sunset);
                weatherIconClass = weatherIcon(data.icon, tod);

                var weatherIconHTML = document.getElementById("weatherIcon");
                weatherIconHTML.classList.add(weatherIconClass);

                var backgroundVidSrc = backgroundVid(data.icon, tod);
                var video = document.getElementById('headerVideo');
                video.src = 'videos/' + backgroundVidSrc;
                video.play();                
            } else {
                badLoc();
            }
    })
}

function tryGPS(callback) {

    if (navigator.geolocation) {
        var lat_lng = navigator.geolocation.getCurrentPosition(function(position){
          var user_position = {};
          user_position.lat = position.coords.latitude; 
          user_position.lng = position.coords.longitude; 
          callback(user_position);
        });
    } else {
        printError('Browser cannot support GPS location.');
    }
}
function printLatLon(position) {

    document.getElementById('locationLat').innerHTML = position.coords.latitude;
    document.getElementById('locationLon').innerHTML = position.coords.longitude;

    return position.coords.latitude + ',' + position.coords.longitude;
}
function gpsBad(error) {
    printError(error.message);
}
function printError(message) {
    document.getElementById('locationError').innerHTML += message + '<br>';
    badLoc();
}
function clearErrors() {
    document.getElementById('locationError').innerHTML = '';
}
function checkCoords(lat, lon) {
    
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    
    error = false;
    errmsg = '';

    while(!error) {
        
        // Lets make sure they are good to start
        if (isNaN(lat) || isNaN(lon)) {
            error = true;
            errmsg = 'Given value is not a number or invalid.';
        }
        //  First lets do lat
        if(lat < -90 || lat > 90) {
            error = true;
            errmsg = 'Latitude is out of bounds.';
        }

        //  Next is lon
        if(lon < -180 || lon > 80) {
            error = true;
            errmsg = 'Longitude is out of bounds.';
        }

        error = true;
    }

    if(errmsg !== '') {
        printError(errmsg);
        return false;
    } else {
        return true;
    }
    


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
function backgroundVid(code, tod) {

    //  Thunderstorm
    if(code >= 200 && code <= 299) {
        if(tod === 'day') {
            return 'thunderstormday.mp4';
        } else {
            return 'thunderstormnight.mp4';
        }
    }
    //  Drizzle
    else if(code >= 300 && code <= 399) {
        if(tod === 'day') {
            return 'drizzleday.mp4';
        } else {
            return 'drizzlenight.mp4';
        }
    }
    //  Rain
    else if(code >= 500 && code <= 599) {
        if(tod === 'day') {
            return 'rainday.mp4';
        } else {
            return 'rainnight.mp4';
        }
    }
    //  Snow
    else if(code >= 600 && code <= 699) {
        if(tod === 'day') {
            return 'snowday.mp4';
        } else {
            return 'snownight.mp4';
        }
    }
    //  Atmosphere
    else if(code == 701) {
        return 'mist.mp4';
    }
    else if(code == 711) {
        return 'smoke.mp4';
    }
    else if(code == 721) {
        return 'haze.mp4';
    }
    else if(code == 731) {
        return 'dust.mp4';
    }
    else if(code == 741) {
        if(tod === 'day') {
            return 'fogday.mp4';
        } else {
            return 'fognight.mp4';
        }
    }
    else if(code == 751) {
        return 'sand.mp4';
    }
    else if(code == 761) {
        return 'dust.mp4';
    }
    else if(code == 762) {
        return 'dust.mp4';
    }
    else if(code == 771) {
        return 'squalls.mp4';
    }
    else if(code == 781) {
        return 'tornado.mp4';
    }
    else if(code == 800) {
        if(tod === 'day') {
            return 'clearday.mp4';
        } else {
            return 'clearnight.mp4';
        }
    }
    else if(code > 800) {
        if(tod === 'day') {
            return 'cloudyday.mp4';
        } else {
            return 'cloudynight.mp4';
        }
    }
    else {
        return "poop";
    }
}
function goodLoc() {
    //  Change location icon to green
    var locationIcon, goodStyle, classArray;
    locationIcon = document.getElementById("locationIcon");
    goodStyle = "text-success";
    badStyle = "text-danger";
    classArray = locationIcon.className.split(" ");
    if (classArray.indexOf(badStyle) !== -1) {
        locationIcon.className = "material-icons mr-2";
    }

    if (classArray.indexOf(goodStyle) == -1) {
        locationIcon.className += " " + goodStyle;
    }


    //  Print success text
    var goodText = 'Gotcha! We have found your location by using your browser’s geolocation. It is important to note that your location and any other data is not stored on our website. Here are some details we could find:';
    document.getElementById("locationStatusText").innerHTML = goodText;
    clearErrors();
}
function badLoc() {
    //  Change location icon to red
    var locationIcon, badStyle, classArray;
    locationIcon = document.getElementById("locationIcon");
    goodStyle = "text-success";
    badStyle = "text-danger";
    classArray = locationIcon.className.split(" ");
    if (classArray.indexOf(goodStyle) !== -1) {
        locationIcon.className = "material-icons mr-2";
    }

    if (classArray.indexOf(badStyle) == -1) {
        locationIcon.className += " " + badStyle;
    }

    //  Print success text
    var badText = 'Oh no! We could not get your location and have defaulted back to the station home of Orlando, FL. To ensure that we can get your location, please allow the website to have your location and refresh. We never store any of the information that we are given, and your information will only be available locally.';
    document.getElementById("locationStatusText").innerHTML = badText;
}
function manualWeather() {
    var givenLat = parseFloat(document.getElementById("manualLat").value);
    var givenLon = parseFloat(document.getElementById("manualLon").value);

    if(checkCoords(givenLat, givenLon)){
        getWeather(givenLat, givenLon);
        goodLoc();
        $('#locationModal').modal('hide');
    } else {
        printError('There was an issue locating the given coordinates.');
        badLoc();
        document.getElementById("manualLat").value = '';
        document.getElementById("manualLon").value = '';
    }
}
