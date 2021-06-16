// key='79f9a322a267f7fbef924c1285ee1331'

export const weatherService = {
    getWeather
}


function getWeather(lat, lon) {
   return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=79f9a322a267f7fbef924c1285ee1331`).then(res => {
        var weather = {
            tmp: parseInt(res.data.main.temp / 10),
            desc: res.data.weather[0].description,
            city: res.data.name
        }
        console.log(weather);
        return Promise.resolve(weather) ;
      })
   
} 
// return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=79f9a322a267f7fbef924c1285ee1331`).then(res => {
    //     res.json().then(r => {

    //         var weather = {
    //             tmp: r.main.temp / 10,
    //             desc: r.weather[0].description,
    //             city: r.name
    //         }
    //         console.log(weather);
    //         return Promise.resolve(weather) ;
    //     })
    // }
    // )