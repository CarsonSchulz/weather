<?php

if(empty($_GET['lat']) || empty($_GET['lon'])) {
    push_error('Latitude and longitude required.');
} else {
    if(!is_numeric($_GET['lat']) || !is_numeric($_GET['lon'])) {
        push_error('Latitude and longitude must be numeric.');
    } else {
        $latitude = $_GET['lat'];
        $longitude = $_GET['lon'];
    }
}

$urlBuild = 'https://geocode.xyz/' . $latitude . ',' . $longitude . '?geoit=json';
$geojson = file_get_contents($urlBuild);
$geoobj = json_decode($geojson);

//print_r($geoobj);

$cityName = ucwords(strtolower($geoobj->city));
$stateCode = $geoobj->state;



$wxUrlBuild = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $latitude . '&lon=' . $longitude . '&appid=0f0faf9f3f35e83ed7def982629ce495';
$wxjson = file_get_contents($wxUrlBuild);
$wxobj = json_decode($wxjson);

$temp = kelvin_to_f($wxobj->main->temp);
$conditions = ucwords($wxobj->weather[0]->description);
$iconcode = $wxobj->weather[0]->icon;

$wxReport = (object)[];
$wxReport->status = 1;
$wxReport->lat = $latitude;
$wxReport->lon = $longitude;
$wxReport->city = $cityName;
$wxReport->state = $stateCode;
$wxReport->temp = $temp;
$wxReport->cond = $conditions;
$wxReport->icon = $iconcode;

$wxJsonPrint = json_encode($wxReport);
echo $wxJsonPrint;

function push_error($errmsg){
    $badReport = (object)[];
    $badReport->status = 0;
    $badReport->message = $errmsg;
    $badReportPrint = json_encode($badReport);
    echo $badReportPrint;
    die();
}
function kelvin_to_f($temp) {
    return round(($temp - 273.15) * (9/5) + 32);
}
?>