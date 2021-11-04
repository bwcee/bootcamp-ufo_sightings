import express, { request, response } from "express";
import { read, add, edit, remove, editOneElement } from "./json_arw.js";
import methodOverride from "method-override";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));


// Render Home page
const goHome = (request, response) => {
  read("data.json", (err, data) => {
    const sightingsArr = data.sightings;
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/home", { sightingsArr });
  });
};

// Render a single sighting
const showFullSighting = (request, response) => {
  const { indexToShow } = request.params;
  read("data.json", (err, data) => {
    const thisSighting = data.sightings[indexToShow];
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/full_sighting", { thisSighting });
  });
};

// Create new sighting
const submitSighting = (request, response) => {
  response.render("pages/submit_form");
};

const doSubmitSighting = (request, response) => {
  const newSighting = request.body;
  add("data.json", "sightings", newSighting, (err) => {
    if (err) {
      response.status(500).send("DB write error.");
      return;
    }
    response.redirect(301, "/");
  });
}

// Edit sighting
const editSighting = (request, response) => {
  const { indexToEdit } = request.params;
  console.log('This is indexToEdit', indexToEdit)
  read("data.json", (err, data) => {
    console.log('This is data.sightings', data.sightings)
    const thisSighting = data.sightings[indexToEdit];
    console.log('thisSighting before adding index', thisSighting)
    thisSighting.index = indexToEdit 
    console.log('thisSighting after adding index', thisSighting)
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/edit", { thisSighting });
  });
};

const doEditSighting = (request, response) => {
  const editedSighting = request.body;
  const { indexToEdit } = request.params;
  editOneElement(
    "data.json",
    "sightings",
    indexToEdit,
    editedSighting,
    (err) => {
      if (err) {
        response.status(500).send("DB write error.");
        return;
      }
      response.redirect(301, "/");
    }
  );
};

// Delete sighting
const deleteSighting = (request, response) => {
  // {indexToDelete} is a destructuring method to assign value of indexToDelete key in request.params to indexToDelete
  const { indexToDelete } = request.params;
  remove("data.json", "sightings", indexToDelete, (err) => {
    if (err) {
      response.send("Not able to delete!");
      return;
    }
    response.redirect(303, "/");
  });
};

app.get("/", goHome);
app.get("/sighting/:indexToShow", showFullSighting);
app.get("/sighting", submitSighting);
app.post("/sighting", doSubmitSighting);
app.get("/sighting/edit/:indexToEdit", editSighting);
app.put("/sighting/edit/:indexToEdit", doEditSighting) 
app.delete("/sighting/delete/:indexToDelete", deleteSighting)

app.listen(3004);
