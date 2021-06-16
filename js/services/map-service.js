import { storageService } from './storage-service.js';
import { utilsService } from './utils-service.js'

// const API_KEY='AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    addPlace,
    deleteMarker,
    getCoords
}

var gMap;
var gMarkers = [];
var gMyLocMarker

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
            gMyLocMarker = new google.maps.Marker({
                position: { lat, lng },
                map: gMap,
                title: 'home'
            });

            gMap.setCenter(new google.maps.LatLng(lat, lng));
            gMap.addListener('click', onAddPlace)
        })

}

function addPlace(event) {

    var mapZoom = gMap.zoom;
    var startLocation = event.latLng;

    var locName = prompt(' enter location name')
   
    addMarker({ lat: startLocation.lat(), lng: startLocation.lng() },locName)
    const loc = { id: utilsService._makeId(), lat: startLocation.lat(), lng: startLocation.lng(), name: locName };
    return Promise.resolve(loc)

}
function deleteMarker() {
    gMarkers.forEach(marker => {
        marker.setMap(null);
        marker = null;

    })
    gMarkers = new Array();
  
}
function addMarker(loc, title) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title
    });
    gMarkers.push(marker);
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
    //const addressMap = storageService.loadFromStorage(KEY)
    // if (addressMap[address]) return Promise.resolve(addressMap[adress]);
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDnTdjdUzBn6wydujWuOgw5AnxioVkVfac`)

    .then(res => {
        return res.data.results[0].geometry.location;
    })
}