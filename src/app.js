const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { title } = require("process");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//define paths for express config
const publicdirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(path.join(publicdirectoryPath)));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather ",
    name: "Andrew mead",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me ",
    name: "Andrew mead",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helptext: "This is some helpfull text",
    title: "Help",
    name: "Andrew mead",
  });
});

app.get("", (req, res) => {
  res.send("<h1>Weather</h1>");
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geoCode(req.query.address, (error, { latitude, longitude, location }={}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location: location,
        address: req.query.address,
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search therm",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Help rticle not found!",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Page not found!",
  });
});

app.listen(port, () => {
  console.log("Server is up on port 3000" + port);
});
