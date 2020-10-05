const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const passport = require('passport');
const path = require('path');
const app = express();
// DB Config

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;
console.log('tteest');
// Connect to MongoDB

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDb Connected');
  })
  .catch((err) => console.error(err));

//Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//  Server static assets if in production

if (process.env.NODE_ENV === 'production') {
  console.log('==============1111');
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    console.log('22222222222222222');
    res.sendFile(path.resilve(__dirname, 'client', 'build', 'index.html'));
  });
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on ${port}`));
