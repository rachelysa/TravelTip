

// const API_KEY='AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac'

export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;

function initMap(lat, lng) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });
            var marker = new google.maps.Marker({
                position: {lat,lng},
                map: gMap,
                title: 'Hello World!'
            });

            gMap.addListener('click', addPlace)
        })
       
}
function addPlace(event) {
    console.log('event:', event)
   var mapZoom = gMap.zoom;
   var startLocation = event.latLng;
   
    var posName = prompt(' enter location name')
    var marker = new google.maps.Marker({
        position: { lat: startLocation.lat(), lng: startLocation.lng() },
        map: gMap,
        title: posName
    });
    const pos={ id: gNextId++, lat: startLocation.lat(), lng: startLocation.lng(), name: posName }
    // gPoss.push({ id: gNextId++, lat: startLocation.lat(), lng: startLocation.lng(), name: posName });
    // saveToStorage('myPos', gPoss)
    // renderMyPos(gMap)
    // setTimeout(placeMarker, 600);
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}