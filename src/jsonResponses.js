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

const getOperator = (request, response, operator) => {
    let returnedOp;
  //for(var key in operators) {
      if(operators[operator.callsign]){
          returnedOp = operators[operator.callsign];
      }
  //}

  if (!returnedOp) {
    const responseJSON = {
      message: "the content you are looking for doesn't exsist",
    };

    return respondJSON(request, response, 404, responseJSON);
  }

  const responseJSON = {
    returnedOp,
  };
    
    console.dir(returnedOp);

  return respondJSON(request, response, 200, responseJSON);
};

const getOperatorMeta = (request, response) => respondJSONMeta(request, response, 200);

const notReal = (request, response) => {
  const responseJSON = {
    message: "the content you are looking for doesn't exsist",
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

const addOperator = (request, response, body) => {
  const responseJSON = {
    message: 'Please fill out all parameters',
  };
    

  if (!body.callsign || !body.iconUrl || !body.name || !body.gadget ||
      !body.description || !body.primary || !body.secondary) {
      
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
    
    let statusCode = 201;

    if (operators[body.callsign]) {
        statusCode = 204;
    } else {
        operators[body.callsign] = {};
    }
  

  operators[body.callsign].callsign = body.callsign;
  operators[body.callsign].iconUrl = body.icon;
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


module.exports = {
  getOperator,
  getOperatorMeta,
  notReal,
  notRealMeta,
  addOperator,
};
