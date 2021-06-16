
import { storageService } from './storage-service.js'
// import { storageService } from './services/storage-service'
export const locService = {
    getLocs,
    saveLoc
}


var locs = [
   
]

function getLocs() {
    locs= storageService.loadFromStorage('myLocs')||[];
    return Promise.resolve(locs);
}
function saveLoc(loc){
    locs.push(loc)

         storageService.saveToStorage('myLocs', locs);
         return Promise.resolve(locs);

}