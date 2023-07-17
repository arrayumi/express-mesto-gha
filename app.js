const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect(DB_URL)
  .then(() => {
    console.log('connection successful');
  });

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b3164602d4e3f7445359c4',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Неверный адрес запроса' });
});

app.listen(PORT, () => {
  console.log('start');
});
