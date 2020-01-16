getLocation();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation_success, getLocation_error);
    } else {
        printError('Your browser does not support geolocation services.');
    }
}

function getLocation_success(position){
    getWeather(position.coords.latitude, position.coords.longitude)
}

function getLocation_error(error){
    printError(error.message);
}

function printError(message) {
    document.getElementById("errorMessage").innerHTML = message;
    $('#alertModal').modal('toggle');
    getWeather(28.538160, -81.395743);
}

function getWeather(lat, lon) {

    //  Build URL
    var getURL = 'pulldata.php?lat=' + lat + '&lon=' + lon;

    //  Begin the calls
    jQuery.ajax({
        type: 'GET',
        url: getURL,
        data: {variable: 'value'},
        dataType: 'json',
    }).done(function(data){
            if(data.status === 1) {
                //  Get JS variables
                weatherLoc = data.city + ', ' + data.state;
                weatherTemp = data.temp;
                weatherCity = data.city;
                weatherState = data.state;
                weatherIcon = data.icon;

                //  Display them
                document.getElementById("displayLocation").innerHTML = weatherLoc;
                document.getElementById("displayTemp").innerHTML = weatherTemp;
                document.getElementById("locationCity").innerHTML = weatherCity;
                document.getElementById("locationState").innerHTML = weatherState;
                document.getElementById("locationLat").innerHTML = lat;
                document.getElementById("locationLon").innerHTML = lon;

                //  Icon stuff
                tod = getTOD(data.sunrise, data.sunset);
                weatherIconClass = getWeatherIcon(weatherIcon, tod);

                var weatherIconHTML = document.getElementById("weatherIcon");
                weatherIconHTML.className = 'wi';
                weatherIconHTML.classList.add(weatherIconClass);

                //  Change background video
                var backgroundVidSrc = getbackgroundVid(weatherIcon, tod);
                var backgroundVid = document.getElementById('headerVideo');
                backgroundVid.src = 'videos/' + backgroundVidSrc;
                backgroundVid.play(); 
            } else {
                printError('There was a backend error or an error retrieving data for your location. Try changing your location or manually entering your coordinates.')
            }
    })
}

function manualWeather() {

    //  Get the entered coords
    var givenLat = parseFloat(document.getElementById("manualLat").value);
    var givenLon = parseFloat(document.getElementById("manualLon").value);

    //  Check the given coords
    if(checkCoords(givenLat, givenLon)){
        getWeather(givenLat, givenLon);
        $('#locationModal').modal('hide');
    }

    document.getElementById("manualLat").value = '';
    document.getElementById("manualLon").value = '';
}

function manualWeather_error(message) {
    document.getElementById('manualFormError').innerHTML = message;
}

function checkCoords(lat, lon) {
    
    //  Make sure the entered values are floats
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    
    error = false;
    errmsg = '';

    //  While no error
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
        manualWeather_error(errmsg);
        return false;
    } else {
        return true;
    }
}

function getTOD(sunrise, sunset) {
    var currentTime = new Date();
    sunrise = new Date(sunrise);
    sunset = new Date(sunset);
    if(currentTime > sunrise && currentTime < sunset) {
        return 'day';
    } else {
        return 'night';
    }
}

function getWeatherIcon(code, tod) {
    var iconClass = 'wi-owm-' + tod + '-' + code; 
    return iconClass;
}

function getbackgroundVid(code, tod) {
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