var info = document.getElementById("info");

var svgElem = document.getElementById("billion");
svgElem.addEventListener("contextmenu", function () {
    event.preventDefault();
    return false;
});

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var original;
var source_url;

d3.json("https://raw.githubusercontent.com/JEPPSER/school/master/4DV801/Assignment%201/BillionDollars.json", function (data) {
    original = data;
    switchData(data, null);
})

function switchData(data, color) {
    d3.select("svg").remove();

    var svg = d3.select("#billion")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

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
        .paddingOuter(20);

    var root = d3.hierarchy(data).sum(function (d) { return d.size });
    treemapLayout(root);

    svg
        .selectAll("rect")
        .data(root.descendants())
        .enter()
        .append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("width", function (d) { return d.x1 - d.x0 })
        .attr("height", function (d) { return d.y1 - d.y0 })
        .attr("fill", function (d) { return d.data.color })
        .on("click", function (d) {
            switchData(d.data, d.data.color);
        })
        .on("contextmenu", function (d) {
            switchData(original, null);
        })
        .on("mouseover", function (d) {
            source_url = null;
            info.innerHTML = "<h1>" + d.data.name + "</h1>";
            info.innerHTML += "<h3>Value: " + d.value + " billion dollars</h3>";

            if (d.data.description != undefined) {
                info.innerHTML += "<h3>Description: " + d.data.description + "</h3>"; 
            }

            if (d.data.source_name != undefined) {
                info.innerHTML += "<h3>Source name: " + d.data.source_name + "</h3>";
            }

            if (d.data.source_link != undefined) {
                source_url = d.data.source_link;
                info.innerHTML += "<h3>Source link: " + d.data.source_link + " (press enter key)</h3>";
            }
        })
        .on("mouseout", function (d) {
            info.innerHTML = "";
            source_url = null;
        })

    d3.select("body")
        .on("keydown", function() {
            if (d3.event.key == "Enter" && source_url != null) {
                window.location = source_url;
            }
        })

    var nodes = d3.select('svg g')
        .selectAll('g')
        .data(root.descendants())
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
            if (d.data.name.length > width / 8 || height < 12) {
               return ""; 
            }
            return d.data.name;
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