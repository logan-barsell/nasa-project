const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const results = [];

function isHabitable(planet) {
  return (
    planet['koi_desposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', data => {
        if (isHabitable(data)) {
          results.push(data);
        }
      })
      .on('error', err => {
        console.log('Uh oh,', err);
        reject(err);
      })
      .on('end', () => {
        console.log(`${results.length} habitable planets found`);
        console.log(
          results.map(planet => {
            return planet['kepler_name'];
          })
        );
        console.log('Done.');
        resolve();
      });
  });
}

module.exports = {
  loadPlanetsData,
};
