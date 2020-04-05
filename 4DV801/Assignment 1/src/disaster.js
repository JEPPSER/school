var info = document.getElementById("info");

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1300 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("#disaster")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://raw.githubusercontent.com/JEPPSER/school/master/4DV801/Assignment%201/DisastersScale.json", function (data) {

    var root = d3.hierarchy(data).sum(function (d) { return d.size })

    d3.treemap()
        .size([width - 200, height])
        (root)

    var keys = ["Oil spill", "Forest Loss", "Destroyed land", "UK area", "Earthquakes", "Floods"];

    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#c4b241", "#2e38c7", "#c44f4b", "#249945", "#8F3399", "#8FD1FF"])

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
        .attr("x", width - 175)
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
        .attr("x", width - 150)
        .attr("y", function (d,i) { return i * (size + 5) + (size / 2) })
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    var nodes = d3.select('svg g')
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', function (d) { return 'translate(' + [d.x0, d.y0] + ')' })

    nodes
        .append('text')
        .attr('dx', 2)
        .attr('dy', 14)
        .text(function (d) {
            var width = d.x1 - d.x0;
            var height = d.y1 - d.y0;
            if (d.data.name.length > width / 7 || height < 12) {
               return ""; 
            }
            return d.data.name;
        })
})
