// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#disaster")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// read json data
d3.json("https://raw.githubusercontent.com/JEPPSER/school/master/4DV801/Assignment%201/DisastersScale.json", function (data) {

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data).sum(function (d) { return d.size }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .paddingTop(10)
        .paddingRight(7)
        .paddingInner(3)
        (root)

    var color = d3.scaleOrdinal()
        .domain(["Oil spill", "Forest Loss", "Destroyed land", "UK area", "Earthquakes", "Floods"])
        .range(["#402D54", "#D18975", "#8FD175", "#249945", "#8F0000", "#8FD1FF"])

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function (d) { return color(d.parent.data.name) })

    // Add title for the 3 groups
    svg
        .selectAll("titles")
        .data(root.descendants().filter(function (d) { return d.depth == 1 }))
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 })
        .attr("y", function (d) { return d.y0 + 5})
        .text(function (d) { return d.data.name })
        .attr("font-size", "15px")
        .attr("fill", function (d) { return color(d.data.name) })
})
