

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>金額:</strong> <span style='color:red'>" + d.value + "</span><sstrong>円</strong>";
    })


function changeCityData(data, city){
  	var city_margin = {top: 30, right: 10, bottom: 10, left: 10};
  	
  	var city_svg = d3.select('div#'+city+'-svg').append("svg")
    .attr("class", city+"_graph")
  	.attr("width","100%")
  	.attr("height","600px")
  	.append("g")
    .attr("transform", "translate(" + city_margin.left + "," + city_margin.top + ")");

    city_svg.call(tip);

    d3.csv(data, type, function(error, data) {
    var city_x = d3.scale.linear().range([0, $('div#'+city+'-svg').width()]);
    var city_y = d3.scale.ordinal().rangeRoundBands([0, 600-10], .2);
	  city_x.domain(d3.extent(data, function(d) { return d.value; })).nice();
	  city_y.domain(data.map(function(d) { return d.name; }));

    var city_xAxis = d3.svg.axis().scale(city_x).ticks(5).orient("top");
    var city_yAxis = d3.svg.axis().scale(city_y).orient("right");
    var city_yAxis_position = [];

	  city_svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
      .attr("x", function(d) { 
        city_yAxis_position.push(city_x(Math.min(0, d.value)));
        return city_x(Math.min(0, d.value));
     })
      .attr("y", function(d) { return city_y(d.name); })
      .attr("width", function(d) { return Math.abs(city_x(d.value) - city_x(0)); })
      .attr("height", city_y.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  city_svg.append("g")
      .attr("class", "x axis")
      .call(city_xAxis);

  city_svg.append("g")
      .attr("class", "y axis")
      .attr("transform", 'translate('+city_yAxis_position[0]+',0)')
      .call(city_yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -15)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("分類");

  });

}

function initLoadData(data){
  d3.csv(data, type, function(error, data) {
  x.domain(d3.extent(data, function(d) { return d.scale; })).nice();
  y.domain(data.map(function(d) { return d.name; }));

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
      .attr("x", function(d) { 
        var _x = x(Math.min(0, d.value));
        yAxisStartPoint.push(_x);
        return _x; 
      })
      .attr("y", function(d) { return y(d.name); })
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
      .attr("height", y.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+yAxisStartPoint[0]+",0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Category");

  });
}

function changeData(data){
  console.log("----------");
  d3.csv(data, type, function(error, data) {
  x.domain(d3.extent(data, function(d) { return d.scale; })).nice();
  y.domain(data.map(function(d) { return d.name; }));
  // svg.selectAll("g").remove();

  svg.selectAll(".bar")
      .data(data)
    // .enter().append("rect")
      .attr("class", function(d) { console.log(d.value);return d.value < 0 ? "bar negative" : "bar positive"; })
      .attr("x", function(d) { return x(Math.min(0, d.value));
      })
      .attr("y", function(d) { return y(d.name); })
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
      .attr("height", y.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+yAxisStartPoint[0]+",0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Category");

  });
}

function type(d) {
  d.value = +d.value;
  return d;
}
$( 'input[name="gorin"]:radio' ).change( function() {  
  // $('div#content').empty();
  $('g.x').empty();
  $('g.y').empty();
  changeData('/data/'+$('input[name="gorin"]:checked').val()+'.csv');
  
});

$('div#tokyo-svg').on('click', function() {
  console.log($(this).attr('id'));
  // changeData('/data/tokyo_5degree.csv');
  if(!$('svg.tokyo_graph').size() > 0){
    changeCityData('/data/tokyo_5degree.csv',"tokyo");
  }
});
$('div#sapporo-svg').on('click', function() {
  console.log($(this).attr('id'));
  if(!$('svg.sapporo_graph').size() > 0){
  // changeData('/data/sapporo_5degree.csv');
    changeCityData('/data/sapporo_5degree.csv',"sapporo");
  }
});
$('div#nagano-svg').on('click', function() {
  console.log($(this).attr('id'));
  // changeData('/data/nagano_5degree.csv');
  if(!$('svg.nagano_graph').size() > 0){
    changeCityData('/data/nagano_5degree.csv',"nagano");
  }
});
