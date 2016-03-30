'use strict';

import fs     from 'fs';
import gulp   from 'gulp';
import config from '../config';

gulp.task('configFirebase', () => {
  let firebaseJson = JSON.parse(fs.readFileSync('firebase.json'))

  let rewrites = []

  fs.readdirSync('app/docs/').forEach((docFilename) => {
    const key = docFilename.split('.')[0].toLowerCase()

    rewrites.push({
      "source": `/docs/${key}`,
      "destination": `/docs-${key}.html`
    })
  })

  rewrites.push({
    "source": "**",
    "destination": "/index.html"
  })

  firebaseJson.rewrites = rewrites

  fs.writeFileSync('firebase.json', JSON.stringify(firebaseJson, null, 2))
});
