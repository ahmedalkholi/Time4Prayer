const countriesList = document.querySelector("#countriesList");
const cityInput = document.querySelector('#cityInput')
const box = document.querySelector('#box')
const fajr = document.querySelector(".fajr p");
const shrook = document.querySelector(".shrook p");
const dohr = document.querySelector(".dohr p");
const asr = document.querySelector(".asr p");
const maghreb = document.querySelector(".maghreb p");
const isha = document.querySelector(".isha p");
const hijryData = document.querySelector(".hijry_data");
const timeSection = document.querySelector(".time");



const countryApi = "https://countriesnow.space/api/v0.1/countries"
function getCountries()
{
  fetch(countryApi)
    .then(response => response.json())
    .then(data =>
    {
      data.data.forEach(data =>
        {
          const option = document.createElement('option')
          option.value = data.country
          option.textContent = data.country
          countriesList.appendChild(option)
      })
    })
}
getCountries()


// const cities = [
//   { name: "Cairo", country: "Egypt" },
//   { name: "Alexandria", country: "Egypt" },
//   { name: "banha", country: "Egypt" },
//   { name: "Zagazig", country: "Egypt" },
// ];
// cities.forEach((city) => {
  //   let option = document.createElement("option");
  //   option.value = city.name;
  //   option.text = city.name;
  //   countriesList.appendChild(option);
  // });
  
  
let selectedCountry;
let selectedCity;

const url = "https://api.aladhan.com/v1/timingsByCity?country=egypt&city=";

countriesList.addEventListener("change", function () {
  const selected = this.value;
  selectedCountry = selected;
  fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({country: selectedCountry}),
  })
    .then(res => res.json())
    .then(data =>
    {
      let cities = data.data
      cityInput.addEventListener('input', function ()
      {
        const value = this.value.toLowerCase()
        box.innerHTML = ''
        if (!value) return;
        
        const filtered = cities
          .filter(city => city.toLowerCase().includes(value))
          .slice(0, 10)
        
        filtered.forEach(city =>
        {
          const div = document.createElement('div')
          div.textContent = city

          div.onclick = () =>
          {
            cityInput.value = city
            selectedCity = cityInput.value
            box.innerHTML = ''
            getData(selectedCity);
          }
          box.appendChild(div)
        })
      })
    })
  

  });


function updatedClock() {
  const date = new Date();
  const hours24 = date.getHours();
  const hours12 = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const period = hours24 >= 12 ? "PM" : "AM";

  timeSection.innerHTML = `${hours12}:${minutes}:${seconds} ${period}`;
}
setInterval(() => {
  updatedClock();
}, 1000);
function getData(city) {
  fetch(`${url}${city}`)
    .then((response) => response.json())
    .then((data) => {
      const day = data.data.date.hijri.date.split("-")[0];
      const year = data.data.date.hijri.date.split("-")[2];
      const month = data.data.date.hijri.month.ar;

      hijryData.innerHTML = `${day} ${month} ${year}`;

      const time = data.data.timings;

      function formatTime(timeValue) {
        let [hour, minute] = timeValue.split(":");
        hour = parseInt(hour);
        hour = hour > 12 ? hour - 12 : hour;
        return `${minute} : ${hour}`;
      }

      fajr.innerHTML = formatTime(time.Fajr);
      shrook.innerHTML = formatTime(time.Sunrise);
      dohr.innerHTML = formatTime(time.Dhuhr);
      asr.innerHTML = formatTime(time.Asr);
      maghreb.innerHTML = formatTime(time.Maghrib);
      isha.innerHTML = formatTime(time.Isha);
    })
    .catch((error) => {
      console.log("error handling: ", error);
    });
}
getData("cairo");