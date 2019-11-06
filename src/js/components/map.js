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
    	this.height = window.innerHeight - 100;
    	this.width = window.innerWidth;
		this.margin = {top: 0, right: 0, bottom: 0, left: 0};
		this.cat = "https://img.icons8.com/pastel-glyph/50/000000/cat--v3.png";
		this.centered;

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


		this.g
		//.on("wheel.zoom",() => {
		//         var currScale = this.projection.scale();
		//         var newScale = currScale - 2*event.deltaY;
		//         var currTranslate = this.projection.translate();
		//         var coords = this.projection.invert([event.offsetX, event.offsetY]);
		//         this.projection.scale(newScale);
		//         var newPos = this.projection(coords);
		//         this.projection.translate([currTranslate[0] + (event.offsetX - newPos[0]), currTranslate[1] + (event.offsetY - newPos[1])]);
		//         this.g.selectAll("path").attr("d", this.path);
		//         this.g.selectAll("circle")
		//         	.attr("cx",  (d) => { return this.projection([d.long,d.lat])[0] })
		// 			.attr("cy",  (d) => { return this.projection([d.long,d.lat])[1] })
		// 		this.g.selectAll("image").attr("d", this.path).attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })

		//     })
		    .call(d3.drag().on("drag", () => {
		    	d3.select(".countries").selectAll("text").remove();

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
		      .style("fill", "#ffffff")
		      .style("fill-opacity", "0.15")
		      .style("stroke", "#d32f95")
		      // .on("click",this.clickedPath)
		 
		  this.g.append("g")
		      .attr("class", "land")
		    .selectAll("path")
		      .data(this.land.features)
		    .enter().append("path")
		      .attr("d", this.path)
		      .style("fill", "none")
		      .style("stroke", "#d32f95")


		this.g.selectAll("circle")
			.data(whereBeen.filter(d => {return d.person == "Rachael"})).enter()			
			.append("circle")
			.on("click",this.clickedCircle)

			.attr("class", d => {
				console.log(d.person)
				return d.person == "Sashi" ? "sashi" : "rachael"})
			.attr("cx",  (d) => { return this.projection([d.long,d.lat])[0] })
			.attr("cy",  (d) => { return this.projection([d.long,d.lat])[1] })
			.attr("r", "0px")
			.style("fill", "#d32f95")
			.style("stroke", "#fff")

			.style("opacity", "1")		
			.transition()
			.ease(d3.easeBounce)
			.duration(2000)
			.attr("r", d => {return d.person == "Sashi" ? "10px" : "7px"})

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
	        .attr("width", 20)
	        // .on("click",this.clickedPath);
		}


	clickedCircle(d, i, els) {

		console.log(d)

	  	var x, y, k;
			this.height = window.innerHeight - 100;
    		this.width = window.innerWidth;
			
			this.projection = geoAugust()
                   .scale(260)
                  .translate( [this.width / 2.5, this.height / 1.5]);

			this.path = d3.geoPath().projection(this.projection);
	
		  if (d && this.centered !== d) {
		    // var centroid = this.path.centroid(d);
			x = this.projection([d.long,d.lat])[0];
		    y = this.projection([d.long,d.lat])[1]; 

		    k = 4;
		    this.centered = d;
		  	d3.select(".countries").selectAll("text").remove();

			d3.select(".countries").append("text")
				.attr("x", this.projection([d.long,d.lat])[0] + 10)
				.attr("y", this.projection([d.long,d.lat])[1])
				.text(d.city)

		  	d3.selectAll("image").attr('r', 1/k).attr("height", 20/k).attr("width", 20/k)
			// .attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })
	        .attr("x", (d) => { return -5;})
	        .attr("y", (d) => { return -5;})

	      	d3.selectAll("circle")
				.attr("r", 3);

		  } else {

		  	d3.select(".countries").selectAll("text").remove();
		    x = this.width / 2;
		    y = this.height / 2;
		    k = 1;
		    this.centered = null;

		    d3.selectAll("image").attr('r', 1/k).attr("height", 20/k).attr("width", 20/k)
				// .attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })
		        .attr("x", (d) => { return -25;})
		        .attr("y", (d) => { return -25;})
		    d3.selectAll("circle")
				.attr("r", 5);
		  }

	d3.select(".countries").transition()
      .duration(750)
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1/ k + "px"); 	


	}

}

export { Map };
