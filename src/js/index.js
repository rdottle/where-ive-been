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

