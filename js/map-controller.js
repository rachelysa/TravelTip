

function getPosition() {
    if (!navigator.geolocation) {
        alert("HTML5 Geolocation is not supported in your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(showLocation, handleLocationError);
}
function showLocation(position) {
    var lat = position.coords.latitude
    var lng = position.coords.longitude

    // gMap.setCenter({ lat, lng })
    // gMyLocationMarker.setMap(null)
    // gMyLocationMarker=new google.maps.Marker({
    //     position: { lat, lng },
    //     map: gMap
    // });
    initMap(lat,lng) 

}


function handleLocationError(error) {
    var locationError = document.getElementById("locationError");

    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message;
            break;
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location.";
            break;
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message;
            break;
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location.";
            break;
    }
}
function initMap(lat,lng) {

    var elMap = document.getElementById('map');
    var options = {
        center: { lat, lng },
        zoom: 12
    };

    gMap = new google.maps.Map(
        elMap,
        options
    );
    console.log('gMap:', gMap)
    // renderMyPos(gMap)
    new google.maps.Marker({
        position: { lat, lng },
        map: gMap,
        title: 'my pos'
    });
    gMap.setCenter(new google.maps.LatLng(lat, lng));
    // gMap.addListener('click', addPlace)
}
