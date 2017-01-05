# chorolet
Choropleth of election data using Leaflet.js

Building:

  git clone git@github.com:mamersfo/chorolet.git
  cd chorolet
  npm install jspm --save-dev
  jspm install
  jspm bundle app/**/* - [app/**/*] dependency-bundle.js --inject

Running, e.g.:

  npm install -g serve
  serve
  
Then point your browser to http://localhost:3000
