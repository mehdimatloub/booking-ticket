import express from 'express';
import bodyParser from 'body-parser';
import villesRouter from './controllers/Villes';
import evenementsRouter from './controllers/Evenements';
import salleRouter from './controllers/Salles';
import sessionRoutes from './controllers/Sessions';
import siegeRouter from './controllers/Sieges';
import utilisateurRouter from './controllers/Utilisateurs';
import reservationRouter from './controllers/Reservations';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
});


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/villes', villesRouter);
app.use('/evenements', evenementsRouter);
app.use('/salles', salleRouter.route);
app.use('/sessions', sessionRoutes.route);
app.use('/sieges', siegeRouter);
app.use('/utilisateurs', utilisateurRouter);
app.use('/reservations', reservationRouter);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Server is running');
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database');

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.error('Failed to establish a database connection:', error);
  });
