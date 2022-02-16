const path = require("path");
const fs = require("fs");
const express = require("express");
let notes = require("./db/db.json");
const uuid = require("uuid");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/notes", (req, res) => {
  res.type(".html");
  //res.send("notes.html");
  res.sendFile(path.join(__dirname, "/public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err) => {
    if (err) return console.log(err);
  });
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
    status: "New Note",
  };
  if (!newNote.title || !newNote.text) {
    res.status(400).json({ msg: "Please enter a full note" });
  }
  app.post("/notes", (req, res) => {
    res.json(notes);
  });

  notes.push(newNote);
  res.json(newNote);
});
app.delete("/api/notes/:id", (req, res) => {
  // get the id that is send from frontend
  const myid = req.params.id;
  //  create a new array of mynotes filtering the note with provided id
  const mynotes = notes.filter((note) => {
    return note.id !== myid;
  });
  // replace the notes with filtered mynotes

  notes = mynotes;
  // redirect to the notes page
  res.redirect("/notes");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
