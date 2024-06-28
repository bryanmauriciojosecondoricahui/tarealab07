const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const plantSchema = new mongoose.Schema({
  name: String,
  description: String,
  care: String
});

const Plant = mongoose.model('Plant', plantSchema);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.get('/pug', (req, res) => {
  Plant.find().then((plants) => {
    res.render('index', { title: 'Administrar Plantas', plants: plants });
  }).catch((error) => {
    console.error('Error retrieving plants:', error);
    res.render('index', { title: 'Administrar Plantas', plants: [] });
  });
});

app.post('/addPlant', (req, res) => {
  const { name, description, care } = req.body;
  const newPlant = new Plant({ name, description, care });

  newPlant.save().then(() => {
    console.log('New plant created!');
    res.redirect('/pug');
  }).catch((error) => {
    console.error('Error creating plant:', error);
    res.redirect('/pug');
  });
});

// Ruta para eliminar una planta
app.post('/deletePlant', (req, res) => {
  const plantId = req.body.plantId;

  Plant.findByIdAndDelete(plantId)
    .then((result) => {
      if (result) {
        console.log('Plant deleted:', result);
      } else {
        console.log('Plant not found.');
      }
      res.redirect('/pug');
    })
    .catch((err) => {
      console.error('Error deleting plant:', err);
      res.redirect('/pug');
    });
});

app.listen(3000, () => {
  console.log('Aplicación web dinámica ejecutándose en el puerto 3000');
});
