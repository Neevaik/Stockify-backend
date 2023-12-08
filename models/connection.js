const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://samuelzentou:ALXw7u95CEm6k4ZC@cluster0.zylx2ez.mongodb.net/';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));