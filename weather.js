function getWeatherInfo() {
    const url = generateURL();
    fetch(url)
        .then(response => response.json())
        .then(data => displayWeatherInfo(data));
}

getWeatherInfo();

// 1桁の数字の先頭に0を足す
function add0(number) {
    const strNumber = String(number).length

    if (strNumber == 1) {
        return "0" + number;
    }
    else {
        return number;
    }
}

function getTodayDate(mode) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScriptの月は0から始まるため、1を加える
    const day = today.getDate();
    
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();

    // リスト返し
    if(mode == 1) {
        return [year, add0(month), add0(day)];
    }
    // ⚪︎月⚪︎日フォーマット
    else if(mode == 2) {
        return `${month}月${day}日`;
    }
    // ⚪︎月⚪︎+1日フォーマット
    else if(mode == 3) {
        return `${month}月${day + 1}日`;
    }
    else if(mode == 4) {
        return `${year}年${month}月${day}日 ${add0(hour)}:${add0(minute)}:${add0(second)}`;
    }
}

function generateURL() {
    const [year, month, day] = getTodayDate(1); // 分割代入を使用して年、月、日を取得

    return `https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FTokyo&start_date=${year}-${month}-${day}&end_date=${year}-${month}-${day+1}`;
}

function setData(id, data) {
    document.getElementById(id).innerHTML = data;
}

function displayWeatherInfo(data) {
    setData("day0", getTodayDate(2));
    setData("day1", getTodayDate(3));
    setData("weathercode0", toIcon(data.daily.weather_code[0], iconDict));
    setData("weathercode1", toIcon(data.daily.weather_code[1], iconDict));
    setData("temp_max0", data.daily.temperature_2m_max[0]);
    setData("temp_max1", data.daily.temperature_2m_max[1]);
    setData("temp_min0", data.daily.temperature_2m_min[0]);
    setData("temp_min1", data.daily.temperature_2m_min[1]);
    setData("precipitation0", data.daily.precipitation_sum[0]);
    setData("precipitation1", data.daily.precipitation_sum[1]);
    // 背景色変更
    updateWeatherBackground(data.daily.weather_code[0])
}

iconDict = {};
function getIconDict() {
    fetch("weatherIcon.json")
        .then(response => response.json())
        .then(data => 
            {iconDict = data;}
        );
}

getIconDict();

function toIcon(weatherCode, iconDict) {
    let strWeatherCode = String(weatherCode);

    if(strWeatherCode in iconDict) {
        return iconDict[strWeatherCode];
    }
    else {
        while (strWeatherCode >= 0) {
            if (strWeatherCode in iconDict) {
                return iconDict[strWeatherCode];
            }
            weatherCode--; // 見つからない場合は1減らす  
            strWeatherCode = String(weatherCode);
        }
    }
}

function updateScreen() {
    setData("time", getTodayDate(4));
}

window.onload=updateScreen;
setInterval(updateScreen, 1000);  

function updateWeatherBackground(weather) {
    const timeElement = document.getElementById('time');

    if (weather >= 0, weather <= 44) {
        timeElement.style.backgroundColor = '#f7b733'; // 晴れの日は黄色
    } else {
        timeElement.style.backgroundColor = '#517fa4'; // 雨の日は青色
    }
}