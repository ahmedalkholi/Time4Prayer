const select = document.querySelector('#select')
const fajr = document.querySelector('.fajr p')
const shrook = document.querySelector('.shrook p')
const dohr = document.querySelector('.dohr p')
const asr = document.querySelector('.asr p')
const maghreb = document.querySelector('.maghreb p')
const isha = document.querySelector('.isha p')
const hijryData = document.querySelector('.hijry_data')
const timeSection = document.querySelector('.time')


const cities = [
    { name: "Cairo", country: "Egypt" },
    { name: "Alexandria", country: "Egypt" },
    { name: "banha", country: "Egypt" },
    { name: "Zagazig", country: "Egypt" }
];
let city
cities.forEach(city =>
{
    let option = document.createElement('option')
    option.value = city.name
    option.text = city.name
    select.appendChild(option)
})
const url = 'https://api.aladhan.com/v1/timingsByCity?country=egypt&city='

select.addEventListener('change', function(e)
{
    const selected = this.value
    city = selected
    getData(city)
})

function getData(city)
{
    fetch(`${url}${city}`)
        .then(response => response.json())
        .then(data =>
        {
            const date = new Date()
            const hours24 = date.getHours()
            const hours12 = (date.getHours() % 12) || 12;
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            const period = hours24 >= 12 ? "PM" : "AM"
            timeSection.innerHTML = `${hours12}:${minutes}:${seconds} ${period}`
            const time = data.data.timings
            const day = data.data.date.hijri.date.split('-')[0]
            const year = data.data.date.hijri.date.split('-')[2]
            const month = data.data.date.hijri.month.ar
            hijryData.innerHTML = `${day} ${month} ${year}`
            fajr.innerHTML = time.Fajr
            shrook.innerHTML = time.Sunrise
            dohr.innerHTML = time.Dhuhr
            asr.innerHTML = time.Asr
            maghreb.innerHTML = time.Maghrib
            isha.innerHTML = time.Isha
        })
}
getData('cairo')