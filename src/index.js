const express = require('express');

const app = express();

const donationsRouter = require('./routes/donations');
const profilesRouter = require('./routes/profiles');
const errorHandler = require('./middlewares/errorHandler');

const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/donations', donationsRouter);
app.use('/profiles', profilesRouter);

app.use(errorHandler);

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening to http://localhost:${port}`);
  });
}
