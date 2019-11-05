import * as d3 from 'd3';
import { queue } from "d3-queue";
import { geoAugust } from "d3-geo-projection";

const topojson = require("topojson-client");
const world = require("./../../data/countries_110.json")
class Map {
    
    constructor(opts) {
    	this.land = topojson.feature(world, world.objects.land)
    	this.countries = topojson.feature(world, world.objects.countries)
    	this.graticule = d3.geoGraticule10();
    	this.outline = ({type: "Sphere"});
    	this.height = window.innerHeight - 200;
    	this.width = window.innerWidth;
		this.margin = {top: 0, right: 0, bottom: 0, left: 0};

		this.path = d3.geoPath();

		this.svg = d3.select("#map")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height) 
            .style("overflow", "visible")
            .append('g')
            .attr('class', 'map')


		this.projection = geoAugust()
                   .scale(300)
                  .translate( [this.width / 2.2, this.height / 1.5]);

		this.path = d3.geoPath().projection(this.projection);
		this.ready()
	}

	ready() {
    
	  this.svg.append("g")
	      .attr("class", "countries")
	    .selectAll("path")
	      .data(this.countries.features)
	    .enter().append("path")
	      .attr("d", this.path)
	      .style("fill", "#fff")
	      .style("stroke", "#cdcdcd")
	 
	  this.svg.append("g")
	      .attr("class", "land")
	    .selectAll("path")
	      .data(this.land.features)
	    .enter().append("path")
	      .attr("d", this.path)
	      .style("fill", "none")
	      .style("stroke", "#222222")


	}
}

export { Map };
