import * as d3 from 'd3';
import { queue } from "d3-queue";
import { geoAugust } from "d3-geo-projection";
import * as fish from 'd3-fisheye';

const topojson = require("topojson-client");
const world = require("./../../data/countries_110.json");
const whereBeen = require("./../../data/where.json");
class Map {
    
    constructor(opts) {
    	this.fisheye = fish.radial()
			  .radius(250)
			  .distortion(4)
			  .smoothing(0.5);
    	this.land = topojson.feature(world, world.objects.land)
    	this.countries = topojson.feature(world, world.objects.countries)
    	this.graticule = d3.geoGraticule10();
    	this.outline = ({type: "Sphere"});
    	this.height = window.innerHeight - 100;
    	this.width = window.innerWidth;
		this.margin = {top: 0, right: 0, bottom: 0, left: 0};
		this.cat = "https://img.icons8.com/pastel-glyph/50/2352af/cat--v3.png";
		this.centered;
		this.firstClick;
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
		      .style("fill-opacity", "0.35")
		      .style("stroke", "#d32f95")
		      // .on("click",this.clickedPath)
		 
		  this.g.append("g")
		      .attr("class", "land")
		    .selectAll("path")
		      .data(this.land.features)
		    .enter().append("path")
		      .attr("class", "path-all")
		      .attr("d", this.path)
		      .style("fill", "none")
		      .style("stroke", "#d32f95")


		this.g.selectAll("circle")
			.data(whereBeen.filter(d => {return d.person == "Rachael"})).enter()			
			.append("circle")
			.on("click",this.clickedCircle)

			.attr("class", d => {
				return d.person == "Sashi" ? "sashi" : "rachael"})
			.attr("cx",  (d) => { return this.projection([d.long,d.lat])[0] })
			.attr("cy",  (d) => { return this.projection([d.long,d.lat])[1] })
			.attr("r", "0px")
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


	    this.svg.append("g").attr("class", "zoom-button")

	 //    this.g.on("mousemove", (e) => {
		// 	const mouse = d3.mouse(d3.event.target);
		// 	console.log(mouse)
		// 	this.fisheye.focus(mouse);
		// 	d3.selectAll("circle").each(d => {
	 //          d.fisheye = this.fisheye([d.x, d.y]);
	 //        })
	 //        .attr('cx', (d) => {
	 //          if (mouse[0] > 500) {
	 //            return d.fisheye.x;
	 //          } else {
	 //            return d.fisheye[0];
	 //          }
	 //        })
	 //        .attr('cy', (d) => {
	 //          if (mouse[0] > 500) {
	 //            return d.fisheye.y;
	 //          } else {
	 //            return d.fisheye[1];
	 //          }
	 //        });

	 //        const thing = this.path;
	 //        const fish = this.fisheye
	 //        d3.selectAll(".path-all").attr('d', function(d) {
	        
		//         return thing(
		//           d.geometry.coordinates.map(tuple => {
		//               return fish(tuple);
		//           })
		//         );
		//       });
		// });


		}


	clickedCircle(d, i, els) {

			let selected = d3.select(els[i]);
			selected.classed("clicked", true);
			d3.selectAll("circle:not(." + "clicked" + ")").classed("hide", true);

	  		var x, y, k;
			this.height = window.innerHeight - 100;
    		this.width = window.innerWidth;
			
			this.projection = geoAugust()
                   .scale(260)
                  .translate( [this.width / 2.5, this.height / 1.5]);

			this.path = d3.geoPath().projection(this.projection);
	
		  if (d && this.centered !== d ) {

			d3.select(".countries").append("text").attr("class", "circle-label")
			.attr("x", d3.event.pageX)
			.attr("y", d3.event.pageY)
			.text(d.city)
			
		    // var centroid = this.path.centroid(d);
			x = d3.event.pageX;
		    y = d3.event.pageY; 

		    k = 4;
		    this.centered = d;

		  	d3.selectAll("image").attr('r', 1/k).attr("height", 20/k).attr("width", 20/k)
			// .attr("transform", (d)=> { return "translate(" + this.projection([d.long,d.lat]) + ")"; })
	        .attr("x", (d) => { return -5;})
	        .attr("y", (d) => { return -5;})

	      	d3.selectAll("circle")
				.attr("r", 3);

			d3.select(".countries").transition()
		      .duration(750)
		      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		      .style("stroke-width", 1/ k + "px"); 	

		  } else {
		  	d3.selectAll("circle").classed("clicked", false);
		  	d3.selectAll("circle").classed("hide", false);
		  	d3.selectAll("text").remove()
		    x = this.width / 2;
		    y = this.height / 2;
		    k = 1;
		    this.centered = null;

		    d3.selectAll("image").attr('r', 1/k).attr("height", 20/k).attr("width", 20/k)
		        .attr("x", (d) => { return -25;})
		        .attr("y", (d) => { return -25;})
		    d3.selectAll("circle")
				.attr("r", 5);

			d3.select(".countries").transition()
		      .duration(750)
		      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		      .style("stroke-width", 1/ k + "px"); 	

		  }

	}

}

export { Map };
