import { locService } from './services/loc-service.js'
import { mapService } from './services/map-service.js'



window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onAddPlace = onAddPlace;
window.onSelfLocate = onSelfLocate;
window.onDeleteLoc = onDeleteLoc;
window.onCopyLink = onCopyLink;
window.onFilter = onFilter;

function onInit() {


    onGetUserPos().then(pos => {

        mapService.initMap(pos.lat, pos.lng)
            .then(() => {
                locService.getLocs().then(locs => {
                    renderLocs(locs);

                });
                console.log('Map is ready');
            })
            .catch(() => console.log('Error: cannot init map'));
    })

}

function onCopyLink() {
    var url = getGitLocUrl();
    console.log('url', url);
    /* Get the text field */
    var copyText = document.getElementById("myInput");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
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

function getGitLocUrl() {
    // onGetUserPos().then(pos => {
    // })
    getPosition().then(pos => {
        console.log(`https://github.io/me/travelTip/index.html?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);

    })
}

function onFilter(ev) {
    if (ev) ev.preventDefault();
    console.log('hu');
    const elInputSearch = document.querySelector('input[name=search]');
    mapService.getCoords(elInputSearch.value)
        .then(coords => {
            console.log(coords.lat + " " + coords.lng);
            mapService.panTo(coords.lat, coords.lng);
        }).catch(() => console.log('Error: cannot get coords'));
    //    getCoords(address); 
}


function onSelfLocate() {
    onGetUserPos().then(pos => {
        mapService.panTo(pos.lat, pos.lng)
    })
};

function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);

}

function onAddPlace(event) {
    mapService.addPlace(event).then(loc => {
        locService.saveLoc(loc).then(locs => {
            renderLocs(locs)
        })

    })
}

function onDeleteLoc(locId) {
    locService.deleteLoc(locId).then(locs => {
        mapService.deleteMarker()
        renderLocs(locs)
    })
}

function renderLocs(locs) {
    const strHtml = locs.map(loc => {

        return `<div class="location">
        <div>${loc.name}</div>
       <div> <button onclick="onPanTo('${loc.lat}','${loc.lng}')">Go</button></div>
       <div> <button onclick="onDeleteLoc('${loc.id}')">Delete</button></div>
        </div>`
    }).join('');
    var elLoc = document.querySelector('.locations')
    elLoc.innerHTML = strHtml;
    renderMarkers(locs)
}

function renderMarkers(locs) {
    locs.forEach(loc => {
        mapService.addMarker({ lat: loc.lat, lng: loc.lng }, loc.name)
    })
}