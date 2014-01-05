
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var str;
      if(Math.abs(d.value) < 200){
        str = "<strong>比率:</strong><span style='color:red'>" + d.value + "</span><strong>％</strong>";
      }else str = "<strong>金額:</strong><span style='color:red'>" + d.value + "</span><strong>億円</strong>";
      return str;
    });
    var legend_tokyo = [{label:"推定値:1959-1968",value:716767.55,color:"#eee"},{label:"実績値:1959-1968",value:887124.40,color:"gold"}];
    var legend_sapporo = [{label:"推定値:1966-1975",value:434097.75,color:"#eee"},{label:"実績値:1966-1975",value:800179.50,color:"silver"}];
    var legend_nagano = [{label:"推定値:1999-2000",value:5007308.63,color:"#eee"},{label:"実績値:1999-2000",value:4731501.80,color:"coral"}];
    var svg_width = $('div#tokyo-svg').width();

addForcedCircle("div#tokyo-svg", svg_width, "200", legend_tokyo);
addForcedCircle("div#sapporo-svg", svg_width, "200", legend_sapporo);
addForcedCircle("div#nagano-svg", svg_width, "200", legend_nagano);


function addForcedCircle(targetDOM, width, height, legend){
  var labelDistance = 20;

  var vis = d3.select(targetDOM).append("svg:svg").attr("width", width).attr("height", height)
  .on('mouseover', function(){ d3.select(targetDOM).style({"background-color":'#eee'})})
  .on('mouseout', function(){ d3.select(targetDOM).style({"background-color":'white'})});
  
  // vis.append("g").append("text")
  // .attr("transform","translate("+(width-25)+",25)")
  // .text("単位:10億円")
  // .style("text-anchor","end")
  // .style("font-weight", "bold");
  
  vis.call(tip);

  var nodes = [];
  var labelAnchors = [];
  var labelAnchorLinks = [];
  var links = [];

  for(var i = 0; i < legend.length; i++) {
    var node = {
      label : legend[i].label,
      value : legend[i].value,
      color : legend[i].color
    };
    nodes.push(node);
    labelAnchors.push({
      node : node
    });
    labelAnchors.push({
      node : node
    });
  };

  for(var i = 0; i < nodes.length; i++) {
    for(var j = 0; j < i; j++) {
      // if(Math.random() > .95)
        links.push({
          source : i,
          target : j,
          weight : Math.random()
        });
    }
    labelAnchorLinks.push({
      source : i * 2,
      target : i * 2 + 1,
      weight : 1
    });
  };

  var force = d3.layout.force().size([width, height]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function(x) {
    return x.weight * 10
  });


  force.start();

  var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([width, height]);
  force2.start();

  var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

  var node = vis.selectAll("g.node")
  .data(force.nodes()).enter()
  .append("svg:g")
  .attr("class", "node");

  node.append("svg:circle")
  .attr("r", function(d, i){ return Math.sqrt(d.value/700);})
  .style("fill", function(d, i){return d.color;})
  .style("stroke", "#FFF")
  .style("stroke-width", 3)
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);
  node.call(force.drag);

  // d3.csv("/data/sumdata.csv", function(error, data) {
  //   node.selectAll().data(data)
  //   .append("svg:circle")
  //   .attr("r",function(d, i){return Math.sqrt(d.tokyo/700);})
  //   .style("fill", "#555")
  //   .style("stroke", "#FFF")
  //   .style("stroke-width", 3);
  //   node.call(force.drag);
  // }

  var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks).enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

  var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
  anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
  anchorNode.append("svg:text").text(function(d, i) {
    return i % 2 == 0 ? "" : d.node.label
  }).style("fill", "#555").style("font-family", "Arial").style("font-size", 16)
  // .style("stroke","white").style("stroke-width",.01)
  // .style("text-shadow","1px 1px 1px rgba(194,194,194, .5), -1px -1px 1px rgba(194,194,194, .5), -1px 1px 1px rgba(194,194,194, .5), 1px -1px 1px rgba(194,194,194, .5)");

  var updateLink = function() {
    this.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
  }

  var updateNode = function() {
    this.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }
  // vis.append("g").append("text")
  // .attr("transform","translate("+(width-15)+",15)")
  // .text("単位:10億円")
  // .style("text-anchor","end")
  // .style("font-weight", "bold");

  vis.append("g").append("text")
  .attr("transform","translate(10,15)")
  .text("産業全体の実績値と推計値[単位:10億円]")
  .style("font-size",12)
  .style("text-anchor","start")
  .style("font-weight", "bold");

  vis.append("g").append("text")
  .attr("transform","translate(10,185)")
  .text(((legend[1].value/legend[0].value)-1)*100+"%")
  .style("font-size",12)
  .style("text-anchor","start")
  .style("font-weight", "bold");

  force.on("tick", function() {

    force2.start();
    node.call(updateNode);
    anchorNode.each(function(d, i) {
      if(i % 2 == 0) {
        d.x = d.node.x;
        d.y = d.node.y;
      } else {
        var b = this.childNodes[1].getBBox();

        var diffX = d.x - d.node.x;
        var diffY = d.y - d.node.y;

        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

        var shiftX = b.width * (diffX - dist) / (dist * 2);
        shiftX = Math.max(-b.width, Math.min(0, shiftX));
        var shiftY = 5;
        this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
      }
    });

    anchorNode.call(updateNode);
    link.call(updateLink);
    anchorLink.call(updateLink);

  });
}


function changeCityData(data, city, style){
  	var city_margin = {top: 30, right: 10, bottom: 10, left: 10};
  	
  	var city_svg = d3.select('div#'+city+'-svg').append("svg")
    .attr("class", city+"_"+style+"_graph")
  	.attr("width","100%")
  	.attr("height","400")
  	.append("g")
    .attr("transform", "translate(" + city_margin.left + "," + city_margin.top + ")");

    city_svg.call(tip);

    d3.csv(data, type, function(error, data) {
    var city_x = d3.scale.linear().range([0, $('div#'+city+'-svg').width()]);
    var city_y = d3.scale.ordinal().rangeRoundBands([0, 400-20], .2);
	  city_x.domain(d3.extent(data, function(d) { return d.value; })).nice();
	  city_y.domain(data.map(function(d) { return d.name; }));

    var city_xAxis = d3.svg.axis().scale(city_x).ticks(5).orient("top");
    var city_yAxis = d3.svg.axis().scale(city_y).orient("right");
    var city_yAxis_position = [];

	  city_svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d) { 
        return d.value < 0 ? "bar negative bar-"+city+" "+d.degree : "bar positive bar-"+city+" "+d.degree; 
      })
      // .attr("class", "bar-"+city)
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

  city_svg.append("g")
    .attr("transform", "translate(100,20)")
    .append('div')
    .attr("class","btn-group")
    .append('button')
    .attr("class", "btn btn-default")
    .text("金額")
    // .append("button")
    // .attr("class", "btn btn-default")
    // .text("比率");

    // .offset([10,0])
    // .html(function(d){
    //   return '<div class="btn-group"><button type="button" class="btn btn-default">金額</button><button type="button" class="btn btn-default">比率</button></div>'
    // });

  });

}

// function initLoadData(data){
//   d3.csv(data, type, function(error, data) {
//   x.domain(d3.extent(data, function(d) { return d.scale; })).nice();
//   y.domain(data.map(function(d) { return d.name; }));

//   svg.selectAll(".bar")
//       .data(data)
//       .enter().append("rect")
//       .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
//       .attr("x", function(d) { 
//         var _x = x(Math.min(0, d.value));
//         yAxisStartPoint.push(_x);
//         return _x; 
//       })
//       .attr("y", function(d) { return y(d.name); })
//       .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
//       .attr("height", y.rangeBand())
//       .on('mouseover', tip.show)
//       .on('mouseout', tip.hide);

//   svg.append("g")
//       .attr("class", "x axis")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .attr("transform", "translate("+yAxisStartPoint[0]+",0)")
//       .call(yAxis)
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Category");

//   });
// }

// function changeData(data){
//   console.log("----------");
//   d3.csv(data, type, function(error, data) {
//   x.domain(d3.extent(data, function(d) { return d.scale; })).nice();
//   y.domain(data.map(function(d) { return d.name; }));
//   // svg.selectAll("g").remove();

//   svg.selectAll(".bar")
//       .data(data)
//     // .enter().append("rect")
//       .attr("class", function(d) { console.log(d.value);return d.value < 0 ? "bar negative" : "bar positive"; })
//       .attr("x", function(d) { return x(Math.min(0, d.value));
//       })
//       .attr("y", function(d) { return y(d.name); })
//       .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
//       .attr("height", y.rangeBand())
//       .on('mouseover', tip.show)
//       .on('mouseout', tip.hide);

//   svg.append("g")
//       .attr("class", "x axis")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .attr("transform", "translate("+yAxisStartPoint[0]+",0)")
//       .call(yAxis)
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Category");

//   });
// }

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

$('button#tokyo-more').on('click',function() {
  // if(!$('svg.tokyo_money_graph').size() > 0){
    $('button#tokyo-more').css("display","none");
    $('div#tokyo-change').css("display","block");
    changeCityData('/data/tokyo_5degree.csv',"tokyo", "money");
  // }
});
$('button#sapporo-more').on('click',function() {
  // if(!$('svg.sapporo_money_graph').size() > 0){
    $('button#sapporo-more').css("display","none");
    $('div#sapporo-change').css("display","block");
    changeCityData('/data/sapporo_5degree.csv',"sapporo", "money");
  // }
});
$('button#nagano-more').on('click',function() {
  // if(!$('svg.nagano_money_graph').size() > 0){
    $('button#nagano-more').css("display","none");
    $('div#nagano-change').css("display","block");
    changeCityData('/data/nagano_5degree.csv',"nagano", "money");
  // }
});


$('div#tokyo-svg').on('click', function() {
  if(!$('svg.tokyo_money_graph').size() > 0){
    changeCityData('/data/tokyo_5degree.csv',"tokyo", "money");
  }
});
$('div#sapporo-svg').on('click', function() {
  if(!$('svg.sapporo_money_graph').size() > 0){
  // changeData('/data/sapporo_5degree.csv');
    changeCityData('/data/sapporo_5degree.csv',"sapporo", "money");
    // changeCityData('/data/sapporo_5ratio.csv',"sapporo");
  }
});
$('div#nagano-svg').on('click', function() {
  // changeData('/data/nagano_5degree.csv');
  if(!$('svg.nagano_money_graph').size() > 0){
    changeCityData('/data/nagano_5degree.csv',"nagano", "money");
    // changeCityData('/data/nagano_5ratio.csv',"nagano");
  }
});


$('button#tokyo-money-change').on('click', function() {
  if($('svg.tokyo_ratio_graph').size() > 0){
    $('svg.tokyo_ratio_graph').remove();
    changeCityData('/data/tokyo_5degree.csv',"tokyo", "money");
  }
});

$('button#tokyo-ratio-change').on('click', function() {
  if($('svg.tokyo_money_graph').size() > 0){
    $('svg.tokyo_money_graph').remove();
    changeCityData('/data/tokyo_5ratio.csv',"tokyo", "ratio");
  }
});

$('button#sapporo-money-change').on('click', function() {
  if($('svg.sapporo_ratio_graph').size() > 0){
    $('svg.sapporo_ratio_graph').remove();
    changeCityData('/data/sapporo_5degree.csv',"sapporo", "money");
  }
});

$('button#sapporo-ratio-change').on('click', function() {
  if($('svg.sapporo_money_graph').size() > 0){
    $('svg.sapporo_money_graph').remove();
    changeCityData('/data/sapporo_5ratio.csv',"sapporo", "ratio");
  }
});

$('button#nagano-money-change').on('click', function() {
  if($('svg.nagano_ratio_graph').size() > 0){
    $('svg.nagano_ratio_graph').remove();
    changeCityData('/data/nagano_5degree.csv',"nagano", "money");
  }
});

$('button#nagano-ratio-change').on('click', function() {
  if($('svg.nagano_money_graph').size() > 0){
    $('svg.nagano_money_graph').remove();
    changeCityData('/data/nagano_5ratio.csv',"nagano", "ratio");
  }
});

