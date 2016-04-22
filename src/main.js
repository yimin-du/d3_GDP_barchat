const URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var msgBox = d3.select("svg").append("div")
			.attr("class", "msg-box")

var x = d3.time.scale()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);


var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(d3.time.years, 5);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10, "");

var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr('class', 'chart');

fetch(URL)
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		const data = json.data;
		console.log(data);
		const length = data.length;
		const barWidth = width / length;
		const minDate = new Date(data[0][0]);
		const maxDate = new Date(data[274][0]);


      	  x.domain([minDate, maxDate])
		  y.domain([0, d3.max(data, function(d) { return d[1] })]);

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("$GDP");

		  svg.selectAll(".bar")
		      .data(data)
		      .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(new Date(d[0])); })
		      .attr("width", barWidth)
		      .attr("y", function(d) { return y(d[1]); })
		      .attr("height", function(d) { return height - y(d[1]); });


		$('svg rect').tipsy({ 
		        gravity: 'w', 
		        html: true, 
		        title: function() {
		    	  var d = this.__data__;
		    	  var gdp = d[1];
		    	  var date = new Date(d[0]);
		    	  var year = date.getFullYear(), month = date.getMonth();
		    	  var msg = (month + 1) + '/' + year  + ": " + '$' + gdp;
		          return '<span>' + msg + '</span>'; 
		        }
		      });



	})
	.catch(function(ex) {
    	console.log('parsing failed', ex)
    })

