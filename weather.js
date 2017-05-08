var temp,
loc,
icon,
humidity,
wind,
direction,
units = "metric",
APPID = "f54f0ecc3dfd5f5c8562926dbe03d44c";

msg = " ";
msg = "Weather Online" + msg;position = 0;
function scrolltitle() {
document.title = msg.substring(position, msg.length) + msg.substring(0, position); position++;
if (position > msg.length) position = 0;
window.setTimeout("scrolltitle()",170);
}
scrolltitle();

function updateByZip(zip){
    var url = "http://api.openweathermap.org/data/2.5/weather?" + "zip=" + zip + "&APPID=" + APPID;
    sendRequest(url);
}

function updateByGeo(lat, lon){
    var url = "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + lat + "&lon=" + lon + "&APPID=" + APPID;
    sendRequest(url);   
}

function sendRequest(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var data = JSON.parse(xmlhttp.responseText);
            var weather = {};
            weather.icon = data.weather[0].id;
            weather.temp = k2c(data.main.temp);
            weather.loc = data.name;
            weather.humidity = data.main.humidity;
            weather.wind = mph2kmh(data.wind.speed);
            weather.direction = degreesToDirection(data.wind.deg);
            update(weather);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function degreesToDirection(degrees){
    var range = 360/16;
    var low = 360 - range /2;
    var high = (low + range) % 360;
    var angles = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    for(var i in angles){
        if(degrees >= low && degrees < high)
            return angles[i];
        low = (low + range) % 360;
        high = (high +range) % 360;
    }
    return "N";
}

function k2c(k){
    return +(k - 273.15).toFixed(2);
}

function c2f(c){
    return +(c * 1.8 + 32).toFixed(2);
}

function f2c(f){
    return +((f - 32) / 1.8).toFixed(2);
}

function mph2kmh(mph){
    return +(mph / 0.621371).toFixed(2);
}

function kmh2mph(kmh){
    return +(kmh / 1.60934).toFixed(2);
}

function metric(){
    document.getElementById("windUnits").innerHTML = " kmh";
    document.getElementById("tempUnits").innerHTML = "C";
    units = "metric";
    if(units == "imperial"){
        f2c(weather.temp);
        mph2kmh(weather.wind);
    }
    update(weather);
}

function imperial(){
    document.getElementById("windUnits").innerHTML = " mph";
    document.getElementById("tempUnits").innerHTML = "F";
    units = "imperial";
    if(units == "metric"){
        c2f(weather.temp);
        kmh2mph(weather.wind);
    }
    update(weather);
}

function update(weather){
    temp.innerHTML = weather.temp;
    loc.innerHTML = weather.loc;
    humidity.innerHTML = weather.humidity;
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    icon.src = "images/" + weather.icon + ".png";
}

window.onload = function(){
    temp = document.getElementById('temperature');
    loc = document.getElementById('location');
    icon = document.getElementById('icon');
    humidity = document.getElementById('humidity');
    wind = document.getElementById('wind');
    direction = document.getElementById('direction');
    
    if(!navigator.geolocation){
        var showPosition = function(position){
            updateByGeo(position.coords.latitude, position.coords.longtitude);
        };
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        var zip = window.prompt("Hmm... I couldn't find your location. Please key in your city or your zip code.");
        updateByZip(zip);//singapore = 189971
    }
    update(weather);
};