

// var formatPercent = d3.format(".0%");

// tipのせる系 => 
// posi nega => http://bl.ocks.org/mbostock/2368837

var margin = {top: 30, right: 100, bottom: 10, left: 100},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width])

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .2);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // .tickFormat(formatPercent);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>金額:</strong> <span style='color:red'>" + d.value + "</span><sstrong>円</strong>";
    })

var svg = d3.select("div#content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yAxisStartPoint = [];

svg.call(tip);

initLoadData("/data/tokyo.csv");
// x.domain(d3.extent(-100000, 200000));
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
      // .attr("x", yAxisStartPoint)
      .attr("transform", "translate("+yAxisStartPoint[0]+",0)")
      // .attr("transform", function(d){
      //   var xxx;
      //   if(d){

      //   }
      //   var str = "transform("+  +",0)");
      //   return str;
      // })
      .call(yAxis)
    // .append("line")
    //   .attr("x1", x(0))
    //   .attr("x2", x(0))
    //   .attr("y2", height)
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
$('circle').on('mouseover', function() {
  // window.alert('impact of'+ $(this).attr('id'));
  $('g.x').empty();
  $('g.y').empty();
  console.log($(this).attr('id'));
  changeData('/data/'+$(this).attr('id')+'.csv');
});
