/* Global Variables */
const generateBtn = document.getElementById("generate");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();
// Personal API Key for OpenWeatherMap API
const APIKey = "24004ea06a8d8beb552f7612e67c3629";
// URL
// "api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}&units=metric"

// generateData function
const generateData = async () => {
  const zipCode = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;

  // call fetchData
  const data = await fetchData(zipCode, APIKey);
  if (data) {
    const {
      main: { temp },
      name,
    } = data;
    const finalData = {
      newDate,
      temp: Math.round(temp),
      name,
      feelings,
    };
    // call sendData to send finalData to server
    sendData("/add", finalData);

    // call getData that to retrieve data from server
    getData();
  }
};

// send finalData to server
const sendData = async (url = "", finalData = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalData),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

// get data from express server and update HTML elements
const getData = async () => {
  const response = await fetch("/all");
  try {
    const responseData = await response.json();
    document.getElementById(
      "date"
    ).innerHTML = `<span>Date: </span>${responseData.newDate}`;
    document.getElementById(
      "city"
    ).innerHTML = `<span>City: </span>${responseData.name}`;
    document.getElementById(
      "temp"
    ).innerHTML = `<span>Temp: </span>${responseData.temp} &#176C`;
    document.getElementById(
      "content"
    ).innerHTML = `<span>Feelings: </span>${responseData.feelings}`;
  } catch (error) {
    console.log(error);
  }
};

// get data from weather app
const fetchData = async (code, key) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${code},&appid=${key}&units=metric`
    );
    const responseData = await response.json();
    if (responseData.cod !== 200) {
      document.getElementById("error").innerHTML = responseData.message;
    }
    // clear error
    setTimeout(() => (document.getElementById("error").innerHTML = ""), 2000);

    return responseData;
  } catch (error) {
    console.log(error);
  }
};

// add eventListner to generateBtn
generateBtn.addEventListener("click", generateData);
