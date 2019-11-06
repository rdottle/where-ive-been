import * as d3 from 'd3';
import { queue } from "d3-queue";
import { geoAugust } from "d3-geo-projection";

const topojson = require("topojson-client");
const world = require("./../../data/countries_110.json");
const whereBeen = require("./../../data/where.json");
class Map {
    
    constructor(opts) {
    	this.land = topojson.feature(world, world.objects.land)
    	this.countries = topojson.feature(world, world.objects.countries)
    	this.graticule = d3.geoGraticule10();
    	this.outline = ({type: "Sphere"});
    	this.height = window.innerHeight - 200;
    	this.width = window.innerWidth;
		this.margin = {top: 0, right: 0, bottom: 0, left: 0};
		this.cat = "https://img.icons8.com/pastel-glyph/50/000000/cat--v3.png";

		this.path = d3.geoPath();

		this.svg = d3.select("#map")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height) 
            .style("overflow", "visible")
            .append('g')
            .attr('class', 'map')


		this.projection = geoAugust()
                   .scale(260)
                  .translate( [this.width / 2.5, this.height / 1.5]);

		this.path = d3.geoPath().projection(this.projection);
		this.ready()
	}

	ready() {
    
	  this.g = this.svg.append("g")
	      .attr("class", "countries");


		this.g.on("wheel.zoom",() => {
		        var currScale = this.projection.scale();
		        var newScale = currScale - 2*event.deltaY;
		        var currTranslate = this.projection.translate();
		        var coords = this.projection.invert([event.offsetX, event.offsetY]);
		        this.projection.scale(newScale);
		        var newPos = this.projection(coords);
		        this.projection.translate([currTranslate[0] + (event.offsetX - newPos[0]), currTranslate[1] + (event.offsetY - newPos[1])]);
		        this.g.selectAll("path").attr("d", this.path);
		        this.g.selectAll("circle")
		        	.attr("cx",  (d) => { return this.projection([d.long,d.lat])[0] })
					.attr("cy",  (d) => { return this.projection([d.long,d.lat])[1] })
				this.g.selectAll("image").attr("d", this.path).attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })


		    })
		    .call(d3.drag().on("drag", () => {
		        var currTranslate = this.projection.translate();
		        this.projection.translate([currTranslate[0] + d3.event.dx,
		                              currTranslate[1] + d3.event.dy]);
		        this.g.selectAll("path").attr("d", this.path);
		        this.g.selectAll("circle").attr("cx",  (d) => { return this.projection([d.long,d.lat])[0] })
					.attr("cy",  (d) => { return this.projection([d.long,d.lat])[1] })
				this.g.selectAll("image").attr("d", this.path).attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })


		    }));

	 this.g.selectAll("path")
	      .data(this.countries.features)
	    .enter().append("path")
	      .attr("d", this.path)
	      .style("fill", "#fff")
	      .style("opacity", "0.75")
	      .style("stroke", "#cdcdcd")
	 
	  this.g.append("g")
	      .attr("class", "land")
	    .selectAll("path")
	      .data(this.land.features)
	    .enter().append("path")
	      .attr("d", this.path)
	      .style("fill", "none")
	      .style("stroke", "#222222")


		this.g.selectAll("circle")
			.data(whereBeen.filter(d => {return d.person == "Rachael"})).enter()			
			.append("circle")
			.attr("class", d => {
				console.log(d.person)
				return d.person == "Sashi" ? "sashi" : "rachael"})
			.attr("cx",  (d) => { return this.projection([d.long,d.lat])[0] })
			.attr("cy",  (d) => { return this.projection([d.long,d.lat])[1] })
			.attr("r", "0px")
			.style("fill", "rgba(253, 45, 215)")
			.style("stroke", "#fff")

			.style("opacity", "1")		
			.transition()
			.ease(d3.easeBounce)
			.duration(2000)
			.attr("r", d => {return d.person == "Sashi" ? "10px" : "7px"})
			.transition()
			.ease(d3.easeBounce)
			.duration(2000)
			.attr("r", d => {return d.person == "Sashi" ? "100px" : "5px"})

		this.g.selectAll(".test")
			.data(whereBeen.filter(d => {return d.person == "Sashi"})).enter()
			.append('image')
			.attr('d', d => {return d.person == "Sashi" ? this.path : null})
			.attr('r', 1)
			.attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })
	        .attr("xlink:href", this.cat)
	        .attr("x", (d) => { return -25;})
	        .attr("y", (d) => { return -25;})
	        .attr("height", 20)
	        .attr("width", 20);


		}

}

export { Map };
