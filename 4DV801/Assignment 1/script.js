var info = document.getElementById("info");

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 900 - margin.left - margin.right,
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
        .size([width - 200, height])
        (root)

    var keys = ["Oil spill", "Forest Loss", "Destroyed land", "UK area", "Earthquakes", "Floods"];

    var color = d3.scaleOrdinal()
        .domain(keys)
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
        .on("mouseover", function (d) {
            info.innerHTML = "<h1>" + d.data.name + ": " + d.value + " \u33A1</h1>";
        })
        .on("mouseout", function (d) {
            info.innerHTML = "";
        })

    var size = 20;

    svg
        .selectAll("dots")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 700)
        .attr("y", function (d, i) {
            return i * 25;
        })
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) { return color(d) })

    svg
        .selectAll("labels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 730)
        .attr("y", function (d,i) { return i * (size + 5) + (size / 2) })
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
})
