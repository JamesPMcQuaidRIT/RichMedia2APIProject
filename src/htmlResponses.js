const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => { // Load the main page of the api
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => { // loads the styling of the page
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};


module.exports.getIndex = getIndex;
module.exports.getCSS = getCSS;
