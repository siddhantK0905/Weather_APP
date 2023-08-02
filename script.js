
const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const userInfoContainer=document.querySelector(".user-info-container");

const loadingScreen=document.querySelector(".loading-container");


const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let oldTab= userTab;

oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){

    if(oldTab != newTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //your wheather tab se switch hua hai, search tab active kro aur baki tabs se active remove kro
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");

            searchForm.classList.add("active");
        }
        else{
            //your weather pe click krne ke baad
            searchForm.classList.remove("active");
            //your wheather me aaya hu to weather ki info bhi dikhani padegi

            //jab tak coordinates nahi milte tab tak information hidden rakho
            userInfoContainer.classList.remove("active");

            //first check local storage for coorinates if we save it there
            getfromSessionStorage();

        }

    }

}


userTab.addEventListener('click', ()=> {
    // passing clicked tab as parameter
    switchTab(userTab);
})

searchTab.addEventListener("click", ()=>{
    // passing clicked tab as parameter
    switchTab(searchTab);
})


// Check wheather coordinates available or Not
function  getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    //API call ke pahle grant-display window deactivate kro aur loading page display activate kro
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API call maro
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }

}


//Rendering the values on to web page

function renderWeatherInfo(weatherInfo){

    //fetching the elements
    const cityName= document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc =document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp =document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetching the actual values and assign it to elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all} %`;

}


//If we don't have coordinates then we have to get coordinate

//adding listener to the grant access button

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation(){
    //check browser support to geolocation
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //browser support nahi krta to give alert msg
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}


const searchInput =document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName==="")
    return;

    else
    fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }

}