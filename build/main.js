"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser = require("body-parser");
const Villes = require("./controllers/Villes.js");
const Categories = require("./controllers/Categories.js");
const Carts = require("./controllers/Carts.js");
const Evenements =require("./controllers/Evenements.js");
const Salles = require("./controllers/Salles.js");
const Sessions = require("./controllers/Sessions.js");
const Sieges= require("./controllers/Sieges.js");
const Utilisateurs = require("./controllers/Utilisateurs.js");
const Reservations = require("./controllers/Reservations.js");
const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const cors = require('cors');
const sequelize = new Sequelize(config.development);
sequelize.sync({ force: false })  
  .then(() => {
    console.log('La synchronisation du modèle avec la base de données est terminée.');

  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation du modèle avec la base de données:', error);
  });

  const app =  express();
const port = 3000;
app.use(cors());

app.use(body_parser.json());
app.use('/villes', Villes);
app.use('/categories', Categories);
app.use('/carts', Carts);
app.use('/evenements', Evenements);
app.use('/salles', Salles);
app.use('/sessions', Sessions);
app.use('/sieges', Sieges);
app.use('/utilisateurs', Utilisateurs);
app.use('/reservations', Reservations);
app.get('/', (req, res) => {
    res.send('Server is running');
});
sequelize.authenticate()
    .then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
})
    .catch((error) => {
    console.error('Failed to establish a database connection:', error);
});
