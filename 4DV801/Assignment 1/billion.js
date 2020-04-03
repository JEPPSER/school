var info = document.getElementById("info");

// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1200 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

d3.json("https://raw.githubusercontent.com/JEPPSER/school/master/4DV801/Assignment%201/BillionDollars.json", function (data) {
    switchData(data, null);
})

function switchData(data, color) {
    d3.select("svg").remove();

    var svg = d3.select("#billion")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Calculate the size of the high level children.
    if (data.name == "World wide spending in billion dollars") {
        for (var i = 0; i < data.children.length; i++) {
            var sum = 0;
            for (var j = 0; j < data.children[i].children.length; j++) {
                sum += data.children[i].children[j].size;
            }
            data.children[i].size = sum;
        }
    }

    if (color == null) {
        var keys = ["earning", "losing", "fighting", "spending", "hustling", "giving"];
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#402D54", "#b86b51", "#38ab9a", "#088f1a", "#8F0000", "#2284a8"])
        
        // Set colors
        if (data.children != undefined) {
            for (var i = 0; i < data.children.length; i++) {
                var c = color(data.children[i].name);
                setColor(data.children[i], c);
            }
        }
        data.color = "#FFF";
    } else if (data.children != undefined) {
        for (var i = 0; i < data.children.length; i++) {
            setColor(data.children[i], color);
        }
        data.color = color;
    }

    var treemapLayout = d3.treemap()
        .size([width, height])
        .paddingOuter(10);

    var root = d3.hierarchy(data).sum(function (d) { return d.size });
    
    treemapLayout(root);

    svg
        .selectAll("rect")
        .data(root.descendants())
        .enter()
        .append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0 })
        .attr("height", function(d) { return d.y1 - d.y0 })
        .attr("fill", function(d) { return d.data.color })
        .on("click", function (d) {
            switchData(d.data, d.data.color);
        })
}

function setColor(node, c) {
    node.color = c;

    if (node.children == undefined) {
        return;
    }

    for (var i = 0; i < node.children.length; i++) {
        setColor(node.children[i], c);
    }
}