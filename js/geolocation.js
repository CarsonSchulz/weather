var defaultLat = 28.543984;
var defaultLon = -81.378008;

$.ajax({ 
    type: 'GET', 
    url: 'pulldata.php?lat=28.5&lon=-81.37', 
    data: {variable: 'value'}, 
    dataType: 'json',
    success: function(data) { 
        // you can use data.blah, or if working with multiple rows
        // of data, then you can use $.each()
        if(data.status == 1) {
            console.log(data.state);
        }
    }   
});
