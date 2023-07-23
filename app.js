const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

mongoose.connect(DB_URL)
  .then(() => {
    console.log('mongoDB connected');
  });

app.use(helmet());
app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Неверный адрес запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
