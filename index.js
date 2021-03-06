const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  var n = orgVal.main.temp - 273.15;
  let temperature = tempVal.replace("{%tempval%}", n.toFixed(1));
  var m = orgVal.main.temp_min - 273.15;
  temperature = temperature.replace("{%tempmin%}", m.toFixed(1));
  var o = orgVal.main.temp_max - 273.15;

  temperature = temperature.replace("{%tempmax%}", o.toFixed(1));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);


  return temperature;

};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=London&appid=6cee038341bfdb6f34c7399dac5a9332"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];

        //console.log(arrData);
        const realTimeData = arrData.map((val) =>

          replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        //console.log(realTimeData);
      })


      .on("end", (err) => {
        if (err) return console.log('connection closed due to errors', err);

        res.end();
      });
  }
  else {
    res.end("File not found");
  }
});
server.listen(8000, "127.0.0.1");
