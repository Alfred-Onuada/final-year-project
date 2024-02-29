import {config} from 'dotenv';
config();
import express from 'express';
import appRoutes from './routes/app.routes.js';
import mongoose from 'mongoose';
import { check_auth_status } from './middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  abortOnLimit: true,
  preserveExtension: true,
  limits: {
    fileSize: 1024 * 1024 * 25 // 25mb
  }
}))

const PORT = process.env.PORT || 3024;

async function main() {
  try {
    console.log('Connecting to DB');
    mongoose.connect(process.env.DB_URI);
    console.log('Connected to DB');

    app.use('', check_auth_status, appRoutes);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    })
  } catch (error) {
    console.error('Something went wrong, while starting the app');
    console.error(error);
  }
}

main();