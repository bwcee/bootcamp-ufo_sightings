import express from "express";
import { read, add, edit, remove, editOneElement } from "./json_arw.js";
import methodOverride from "method-override";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set("view engine", "ejs");
// app.use(express.static("/public"));
app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// Render Home page
const goHome = (request, response) => {
  read("data.json", (err, data) => {
    const sightingsArr = data.sightings;
    sightingsArr.forEach((el, index) => {
      el.index = index;
    });
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/home", { sightingsArr });
  });
};

// Sort function to sort list in Home page
const callSort = (arr, sortBy) => {
  arr.sort((a, b) => {
    let toSortA;
    let toSortB;
    a[sortBy] === null
      ? (toSortA = "zzzz")
      : (toSortA = a[sortBy].toLowerCase());
    b[sortBy] === null
      ? (toSortB = "zzzz")
      : (toSortB = b[sortBy].toLowerCase());
    return toSortA > toSortB ? 1 : toSortA < toSortB ? -1 : 0;
  });
  return arr;
};

// Render Home page sorted by Shape
const sortShape = (request, response) => {
  read("data.json", (err, data) => {
    const sightingsArr = data.sightings;
    sightingsArr.forEach((el, index) => {
      el.index = index;
    });
    callSort(sightingsArr, "shape");
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/home", { sightingsArr });
  });
};

// Render Home page sorted by City
const sortCity = (request, response) => {
  read("data.json", (err, data) => {
    const sightingsArr = data.sightings;
    sightingsArr.forEach((el, index) => {
      el.index = index;
    });
    callSort(sightingsArr, "city");
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/home", { sightingsArr });
  });
};

// Render Home page sorted by State
const sortState = (request, response) => {
  read("data.json", (err, data) => {
    const sightingsArr = data.sightings;
    sightingsArr.forEach((el, index) => {
      el.index = index;
    });
    callSort(sightingsArr, "state");
    if (err) {
      response.status(404).send("Git outta here, there's no such page!");
    }
    response.render("pages/home", { sightingsArr });
  });
};

// Render a single sighting
const showFullSighting = (request, response) => {
  const indexToShow = request.params.indexToShow;
  read("data.json", (err, data) => {
    let thisSighting = data.sightings[indexToShow];
    thisSighting.index = indexToShow;
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
    }
    response.redirect(301, "/");
  });
};

// Edit sighting
const editSighting = (request, response) => {
  const { indexToEdit } = request.params;
  read("data.json", (err, data) => {
    const thisSighting = data.sightings[indexToEdit];
    thisSighting.index = indexToEdit;
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
    }
    response.redirect(303, "/");
  });
};

app.get("/", goHome);
app.get("/sort/shape", sortShape);
app.get("/sort/city", sortCity);
app.get("/sort/state", sortState);
app.get("/sighting/:indexToShow", showFullSighting);
app.get("/sighting", submitSighting);
app.post("/sighting", doSubmitSighting);
app.get("/sighting/edit/:indexToEdit", editSighting);
app.put("/sighting/edit/:indexToEdit", doEditSighting);
app.delete("/sighting/delete/:indexToDelete", deleteSighting);

app.listen(3004);
