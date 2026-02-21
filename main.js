// --- 1. تعريف العناصر (الربط مع الـ HTML) ---
const countriesList = document.querySelector("#countriesList");
const cityInput = document.querySelector('#cityInput');
const box = document.querySelector('#box');
const hijryData = document.querySelector(".hijry_data");
const timeSection = document.querySelector(".time");

// عناصر مواقيت الصلاة
const prayerElements = {
    fajr: document.querySelector(".fajr p"),
    shrook: document.querySelector(".shrook p"),
    dohr: document.querySelector(".dohr p"),
    asr: document.querySelector(".asr p"),
    maghreb: document.querySelector(".maghreb p"),
    isha: document.querySelector(".isha p")
};

let allCities = []; // مخزن للمدن

// --- 2. جلب قائمة الدول عند تحميل الصفحة ---
function getCountries() {
    fetch("https://countriesnow.space/api/v0.1/countries")
        .then(res => res.json())
        .then(data => {
            data.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.country;
                option.textContent = item.country;
                countriesList.appendChild(option);
            });
        });
}
getCountries();

// --- 3. عند اختيار دولة: نجلب مدنها ---
countriesList.addEventListener("change", function() {
    const selectedCountry = this.value;
    box.innerHTML = "جاري تحميل المدن...";
    
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry })
    })
    .then(res => res.json())
    .then(data => {
        allCities = data.data; // حفظنا المدن هنا
        box.innerHTML = ""; 
    });
});

// --- 4. نظام البحث الذكي عن المدينة ---
cityInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    box.innerHTML = ''; 
    
    if (!value || allCities.length === 0) return;

    const filtered = allCities
        .filter(city => city.toLowerCase().includes(value))
        .slice(0, 10);

    filtered.forEach(city => {
        const div = document.createElement('div');
        div.className = "suggestion-item";
        div.textContent = city;
        div.onclick = () => {
            cityInput.value = city;
            box.innerHTML = '';
            // استدعاء بيانات الصلاة بناءً على المدينة والدولة المختارة
            getData(city, countriesList.value);
        };
        box.appendChild(div);
    });
});

cityInput.addEventListener('focus', () => cityInput.value = '')

// --- 5. جلب مواقيت الصلاة ---
function getData(city, country) {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const timings = data.data.timings;
            const hijri = data.data.date.hijri;

            // عرض التاريخ الهجري
            hijryData.innerHTML = `${hijri.day} ${hijri.month.ar} ${hijri.year}`;

            // تحديث العناصر (استخدمنا دالة فورمات الوقت اللي كنت عاملها)
            prayerElements.fajr.innerHTML = formatTime(timings.Fajr);
            prayerElements.shrook.innerHTML = formatTime(timings.Sunrise);
            prayerElements.dohr.innerHTML = formatTime(timings.Dhuhr);
            prayerElements.asr.innerHTML = formatTime(timings.Asr);
            prayerElements.maghreb.innerHTML = formatTime(timings.Maghrib);
            prayerElements.isha.innerHTML = formatTime(timings.Isha);
            upNext(timings)
        });
    }
    // --- 6. دوال مساعدة (الوقت والفورمات) ---
    function formatTime(timeValue) {
        let [hour, minute] = timeValue.split(":");
        hour = parseInt(hour);
        let period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${period}`;
}

function upNext(timings)
{
    const now = new Date()
    const currentMinutes = (now.getHours() * 60) + now.getMinutes()
    let prayers = [
        { name: 'fajr', time: timings.Fajr },
        { name: 'shrook', time: timings.Sunrise },
        { name: 'dohr', time: timings.Dhuhr },
        { name: 'asr', time: timings.Asr },
        { name: 'maghreb', time: timings.Maghrib },
        { name: 'isha', time: timings.Isha }
    ]
    let next = prayers.find(p =>
    {
        const [h, m] = p.time.split(':').map(Number)
        return (h * 60 + m) > currentMinutes
    })
    if (!next)  next = prayers[0]
    highlightNext(next.name)
}

function updatedClock() {
    const date = new Date();
    timeSection.innerHTML = date.toLocaleTimeString();
}
setInterval(updatedClock, 1000);

window.onload = () =>
{
    const defaultCountry = 'Egypt'
    const defaultCity = 'Cairo'

    countriesList.value = defaultCountry
    cityInput.value = defaultCity

    getData(defaultCity, defaultCountry)
}

function highlightNext(item)
{
    document.querySelectorAll('.timing div').forEach(card =>
    {
        card.classList.remove('upNext')
    })
    const card = document.querySelector(`.${item}`)
    card.classList.add('upNext')
}