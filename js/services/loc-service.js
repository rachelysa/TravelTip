
import { storageService } from './storage-service.js'
// import { storageService } from './services/storage-service'
export const locService = {
    getLocs,
    saveLoc,
    deleteLoc
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
function deleteLoc(locId){
    var deleteIdx = locs.findIndex(loc=> {
        return (loc.id === locId)
    })

    locs.splice(deleteIdx, 1);
    storageService.saveToStorage('myLocs', locs);
    return Promise.resolve(locs);
}