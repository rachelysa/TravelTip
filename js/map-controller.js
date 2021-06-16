import { locService } from './services/loc-service.js'
import { mapService } from './services/map-service.js'
import { weatherService } from './services/weather-service.js'


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

function onInit(ev) {

    var url = new URL(ev.target.URL.toString());
    var lat = url.searchParams.get('lat');
    var lng = url.searchParams.get('lng');
    
    if (lng && lat) {
        weatherService.getWeather(lat,lng).then(weather=>{
            console.log(weather);
            renderWeather(weather)
        })
        mapService.initMap( parseFloat(lat),  parseFloat(lng))
            .then(() => {
                locService.getLocs().then(locs => {
                    renderLocs(locs);

                });
                console.log('Map is ready');


            })
            .catch(() => console.log('Error: cannot init map'));
    }

    else onGetUserPos().then(pos => {
        weatherService.getWeather(pos.lat, pos.lng).then(weather=>{
            console.log(weather);
            renderWeather(weather)
        })
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
    getGitLocUrl().then(url => {
        console.log(url);
        var copyText = document.getElementById("myInput");
        copyText.value = url;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand('copy');

    });



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
    return getPosition().then(pos => {
        return `https://rachelysa.github.io/TravelTip/index.html?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`;

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
            weatherService.getWeather(coords.lat,coords.lng).then(weather=>{
                console.log(weather);
                renderWeather(weather)
            })
            var name=prompt('enter location name')
            mapService.addMarker({lat:coords.lat,lng:coords.lng},name);
            mapService. createLoc(coords.lat, coords.lng,name).then(loc=>{
                locService.saveLoc(loc).then(locs => {
                    renderLocs(locs)
                })
            })
        }).catch(() => console.log('Error: cannot get coords'));
    //    getCoords(address); 
}


function onSelfLocate() {
    onGetUserPos().then(pos => {
        mapService.addMarker(pos, 'home')
        mapService.panTo(pos.lat, pos.lng)
    })
};

function onPanTo(lat, lng) {
    weatherService.getWeather(lat, lng).then(weather=>{
        console.log(weather);
        renderWeather(weather)
    })
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
        console.log(locs);
        mapService.deleteMarker()
        renderLocs(locs)
    })
}

function renderLocs(locs) {
    const strHtml = locs.map(loc => {

        return `<div class="location">
        <div>${loc.name}</div>
       <div> <button onclick="onPanTo('${loc.lat}','${loc.lng}')" class="btn">Go</button></div>
       <div> <button onclick="onDeleteLoc('${loc.id}')" class="btn">Delete</button></div>
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
function renderWeather(weather){
    const strHtml=`<div>
   
    <h2>city: ${weather.city}</h2>
    <h3>temp: ${weather.tmp}</h3>
    <h4>description: ${weather.desc}</h4>
    </div>`;
    var elWeather=document.querySelector('.weather');
    elWeather.innerHTML=strHtml
}