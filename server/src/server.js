const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  'mongodb+srv://loganjbars:pass@nasa.cxttb.mongodb.net/nasa?retryWrites=true&w=majority&appName=NASA';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB Connection ready...');
});
mongoose.connection.on('error', err => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}...`);
  });
}

startServer();
