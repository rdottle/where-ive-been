// import FormContainer from "./components/container/FormContainer.jsx";
// import ChartContainer from "./components/container/ChartContainer.jsx";

import * as d3 from 'd3';
import './../css/index.scss';
// import AddIcon from '@carbon/icons/es/add/16';
import 'intersection-observer';
require("./api.js");


// import map class and find parent el
import { Map } from "./components/map.js";
const mapContainer = d3.select("#map");

let newMap = new Map();


var clientID = '419164154973-v5rpoogthlb6i121k1cf46m0jjm88nj4.apps.googleusercontent.com';
var API = 'AIzaSyBtIthLcViQ0uDAbXFaXEyDPS8ht5fSfcE';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

function getData() {
    gapi.sheets.spreadsheets.values.get({
      spreadsheetId: '16nH7JsFrUuVLBAwU6bjCuX2GmcnjeYp47Ia7tnEMapw',
      range: 'Sheet1!A2:F',
    }).then(function(response) {
      console.log(response.result.values);
    });
  }

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

function initClient() {
  gapi.client.init({
    apiKey: API,
    clientId: clientID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    getData();
  });
}

handleClientLoad();
