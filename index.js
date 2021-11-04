import express from "express";
import { read, add, edit, remove } from "./json_arw.js";
import methodOverride from "method-override";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

const goHome = (request, response) => {
  read("data.json", (err, data) => {
    const sightingsArr = data.sightings;
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/home", { sightingsArr });
  });
};

const showFullSighting = (request, response) => {
  const { index } = request.params;
  read("data.json", (err, data) => {
    const thisSighting = data.sightings[index];
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/full_sighting", { thisSighting });
  });
};

const submitSighting = (request, response) => {
  response.render("pages/submit_form");
};

app.post("/sighting", (request, response) => {
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

app.delete("/sighting/delete/:index", (request, response) => {
  // { index } is a destructuring method
  const { indexToRemove } = request.params;
  remove("data.json", "sightings", indexToRemove, (err) => {
    if (err) {
      response.send("Not able to delete!");
      return;
    }
    response.redirect(303, "/");
  });
});

app.get("/", goHome);
app.get("/sighting/:index", showFullSighting);
app.get("/sighting", submitSighting);

app.listen(3004);
