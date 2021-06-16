import { locService } from './services/loc-service.js'
import { mapService } from './services/map-service.js'



window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onAddPlace = onAddPlace;
window.onSelfLocate = onSelfLocate;


function onInit() {
    locService.getLocs().then(locs => {
        renderLocs(locs)
    });
    onGetUserPos().then(pos => {
        mapService.initMap(pos.lat, pos.lng)
            .then(() => {
                console.log('Map is ready');

            })
            .catch(() => console.log('Error: cannot init map'));
    })

}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    return getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            var position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            return Promise.resolve(position)

        })
        .catch(err => {
            console.log('err!!!', err);
            return Promise.reject('err')
        })
}

function onSelfLocate() {
    onGetUserPos().then(pos => {
        mapService.panTo(pos.lat, pos.lng)
    })
};

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onAddPlace(event) {
    mapService.addPlace(event).then(loc => {
        locService.saveLoc(loc).then(locs => {
            renderLocs(locs)
        })

    })
}

function renderLocs(locs) {
    const strHtml = locs.map(loc => {
        console.log(loc);
        return `<div class="location">
        <div>${loc.name}</div>
        <button>Go</button>
        <button>Delete</button>
        </div>`
    }).join('');
    var elLoc = document.querySelector('.locations')
    elLoc.innerHTML = strHtml;
}