$(document).ready(function($) {
    //  Start by grabbing the GPS location
    tryGPS();
    //  Check to see if there is any values for the lat and long
    setTimeout(function(){
        var lat = parseFloat(document.getElementById('locationLat').innerHTML);
        var lon = parseFloat(document.getElementById('locationLon').innerHTML);
        //  Uncomment below to set a manual lat/lon
        lat = 22.325663;
        lon = 114.198654;
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

                    document.getElementById("displayLocation").innerHTML = weatherLoc;
                    document.getElementById("displayTemp").innerHTML = weatherTemp;
                    document.getElementById("locationCity").innerHTML = weatherCity;
                    document.getElementById("locationState").innerHTML = weatherState;

                    //  Display icons
                    tod = nightOrDay(data.sunrise, data.sunset);
                    weatherIconClass = weatherIcon(data.icon, tod);

                    var weatherIconHTML = document.getElementById("weatherIcon");
                    weatherIconHTML.classList.add(weatherIconClass);

                    var backgroundVidSrc = backgroundVid(data.icon, tod);
                    var video = document.getElementById('headerVideo');
                    video.src = 'videos/' + backgroundVidSrc;
                    video.play();
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