const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const postHandler = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addOperator') {//Loads data into the body
    const res = response;
    const body = [];

    request.on('error', (err) => {//Error if the data was not properly given
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {//Ensures size of data
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addOperator(request, res, bodyParams);
    });
  }
};

const getHandler = (request, response, parsedUrl) => {//Checks for url of get requests
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getOperator') {
    jsonHandler.getOperator(request, response, query.parse(parsedUrl.query));
  } else if (parsedUrl.pathname === '/loadOperators') {
    jsonHandler.loadOperators(request, response);
  } else {
    jsonHandler.notReal(request, response);
  }
};

const headHandler = (request, response, parsedUrl) => {//Checks url of head requests
  if (parsedUrl.pathname === '/getOperator') {
    jsonHandler.getOperatorMeta(request, response);
  } else {
    jsonHandler.notRealMeta(request, response);
  }
};


const onRequest = (request, response) => {//When a request is made, checks and assigns the method
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    postHandler(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    getHandler(request, response, parsedUrl);
  } else {
    headHandler(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
