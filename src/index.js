const express = require("express");
const app = express();

const donationsRouter = require('./routes/donations');
const profilesRouter = require('./routes/profiles');

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to the Raisely API");
});

app.use('/donations', donationsRouter);
app.use('/profiles', profilesRouter);


module.exports = app;

if (process.env.NODE_ENV !== "TEST") {
  app.listen(port, () => {
    console.log(`Server listening to http://localhost:${port}`);
  });
}
