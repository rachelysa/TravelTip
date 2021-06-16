import { storageService } from './storage-service.js';
import { utilsService } from './utils-service.js'

// const API_KEY='AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    addPlace
}

var gMap;

function initGeoCode(address) {
    return _connectGeocodeApi()
    then(() => {
        console.log()
    })
}

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
                position: { lat, lng },
                map: gMap,
                title: 'Hello World!'
            });

            gMap.addListener('click', onAddPlace)
        })

}

function addPlace(event) {
    console.log('event:', event)
    var mapZoom = gMap.zoom;
    var startLocation = event.latLng;

    var locName = prompt(' enter location name')
    var marker = new google.maps.Marker({
        position: { lat: startLocation.lat(), lng: startLocation.lng() },
        map: gMap,
        title: locName
    });
    const pos = { id: utilsService._makeId(), lat: startLocation.lat(), lng: startLocation.lng(), name: locName };
    return Promise.resolve(pos)

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

function getCoords(address) {
    //  const addressMap = storageService.loadFromStorage(KEY)
    //   if (addressMap[address]) return Promise.resolve(addressMap[adress]);
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac`)
        .then(res = res.data)


}

// function _connectGeocodeApi() {
//     if (window.google) return Promise.resolve()

//     var elGeocodeApi = document.createElement('script');
//     elGeocodeApi.src = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac';
//     elGeocodeApi.async = true;
//     document.body.append(elGeocodeApi);

//     return new Promise((resolve, reject) => {
//         elGeocodeApi.onload = resolve;
//         elGeocodeApi.onerror = () => reject('Google script failed to load')
//     })
// }