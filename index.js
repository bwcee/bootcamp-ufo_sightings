import express from "express";
import { read, add } from "./json_arw.js";
import methodOverride from 'method-override';

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const goHome = (request, response) => {
  read('data.json', (err, data) => {
    const sightingsArr = data.sightings;
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render('pages/home', { sightingsArr });
  });
  
};

const submitSighting = (request, response) => {
  response.render("submit_form");
};

app.post("/sighted", (request, response) => {
  // Add new recipe data in request.body to recipes array in data.json.
  const newSighting = request.body;
  add("data.json", "sightings", newSighting, (err) => {
    if (err) {
      response.status(500).send("DB write error.");
      return;
    }
    console.log("The request body in add() is", newSighting);
    response.redirect(301, "/");
  });
});

app.delete('/sighting/delete/:index', (request, response) => {
  // Remove element from DB at given index
  const { index } = request.params;
  read('data.json', (err, data) => {
    data['recipes'].splice(index, 1);
    write('data.json', data, (err) => {
      response.send('Done!');
    });
  });
});

app.get("/sighting", submitSighting);
app.get("/", goHome);

app.listen(3004);
