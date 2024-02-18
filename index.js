import {config} from 'dotenv';
config();
import express from 'express';
import appRoutes from './routes/app.routes.js';
import mongoose from 'mongoose';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(express.json());

const PORT = process.env.PORT || 3024;

async function main() {
  try {
    console.log('Connecting to DB');
    mongoose.connect(process.env.DB_URI);
    console.log('Connected to DB');

    app.use('', appRoutes);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    })
  } catch (error) {
    console.error('Something went wrong, while starting the app');
    console.error(error);
  }
}

main();