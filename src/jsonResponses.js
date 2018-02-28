const operators = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};


// Gets and returns operator data
const getOperator = (request, response, operator) => {
  let returnedOp;
  const reloading = false;

  if (operators[operator.callsign]) { // Assigns the operator data
    returnedOp = operators[operator.callsign];
  }

  if (!returnedOp) { // Checks for if the operator exsists
    const responseJSON = {
      message: "the content you are looking for doesn't exsist",
    };

    return respondJSON(request, response, 404, responseJSON);
  }

  const responseJSON = {
    returnedOp,
    reloading,
  };

  return respondJSON(request, response, 200, responseJSON);// returns operator data
};

// Verifies data
const getOperatorMeta = (request, response) => respondJSONMeta(request, response, 200);

const notReal = (request, response) => { // If the user goes to an invalid url
  const responseJSON = {
    message: "the content you are looking for doesn't exsist",
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

// adds operator to the memory
const addOperator = (request, response, body) => {
  const responseJSON = {
    message: 'Please fill out all parameters',
  };

    // checks to be sure all parameters are filled
  if (!body.callsign || !body.iconUrl || !body.name ||
      !body.gadget || !body.description || !body.primary || !body.secondary) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let statusCode = 201;

  if (operators[body.callsign]) { // Checks if an operator with the same name already exsists
    statusCode = 204;
  } else {
    operators[body.callsign] = {};
  }

  operators[body.callsign].callsign = body.callsign;
  operators[body.callsign].iconUrl = body.iconUrl;
  operators[body.callsign].name = body.name;
  operators[body.callsign].gadget = body.gadget;
  operators[body.callsign].description = body.description;
  operators[body.callsign].primary = body.primary;
  operators[body.callsign].secondary = body.secondary;

  if (statusCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.callsign = operators[body.callsign].callsign;
    return respondJSON(request, response, statusCode, responseJSON);
  }

  return respondJSONMeta(request, response, statusCode);
};

const loadOperators = (request, response) => { // Used to reload memory when you enter the page
  const reloading = true;
  const responseJSON = {
    operators,
    reloading,
  };

  return respondJSON(request, response, 200, responseJSON);
};


module.exports = {
  getOperator,
  getOperatorMeta,
  notReal,
  notRealMeta,
  addOperator,
  loadOperators,
};
