import {config} from 'dotenv';
config();
import express from 'express';
import appRoutes from './routes/app.routes.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));

const PORT = process.env.PORT || 3024;

async function main() {
  try {
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