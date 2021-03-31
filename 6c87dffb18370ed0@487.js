// https://observablehq.com/@kerryrodden/sequences-sunburst@487

//-------------------------------------------------------------------------------------------------------------------------------------------
function setSessionItem(name, value) {
  var mySession;
  try {
    mySession = JSON.parse(localStorage.getItem('mySession'));
  } catch (e) {
    console.log(e);
    mySession = {};
  }

  mySession[name] = value;

  mySession = JSON.stringify(mySession);

  localStorage.setItem('mySession', mySession);
}

function getSessionItem(name) {
  var mySession = localStorage.getItem('mySession');
  if (mySession) {
    try {
      mySession = JSON.stringify(mySession);
      console.log(mySession[name]);
      return mySession[name];
    } catch (e) {
      console.log(e);
    }
  }
}

function restoreSession(data) {
    for (var x in data) {
        //use saved data to set values as needed
        console.log(x, data[x]);
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------


export default function define(runtime, observer) {
  const main = runtime.module();
  //-----------------------------------------------------------------------------------------------------------------------------------------------

  var mySession = localStorage.getItem('mySession');
  if (mySession) {
      try {
          mySession = JSON.parse(localStorage.getItem('mySession'));
      } catch (e) {
          console.log(e);
          mySession = {};
      }
      restoreSession(mySession);
  } else {
      localStorage.setItem('mySession', '{}');
  }

  //setSessionItem('foo', Date.now()); //should change each time

  /*if (!mySession.bar) {
      setSessionItem('bar', Date.now()); //should not change on refresh
  }*/

  $("jimmy").onclick = function() { setSessionItem('foo', true); location.reload(); };
  $("jonny").onclick = function() { setSessionItem('foo', false); location.reload(); };

  console.log(mySession["foo"]);

  if (mySession["foo"]) {
    const fileAttachments = new Map([["visit-sequences@1.csv",new URL("./files/jimmysData",import.meta.url)]]);
    main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  } else {
    const fileAttachments = new Map([["visit-sequences@1.csv",new URL("./files/4b8bc441afab87356f7b5cc5aef3130f4ca634aaae3a46ba7c0f7950b152bc9cdd9bbddae444d694f3e3b4d43587419a17eb0bd5fbd340ce6d6c7b31907bfc7b",import.meta.url)]]);
    main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------

  main.variable(observer("breadcrumb")).define("breadcrumb", ["d3","breadcrumbWidth","breadcrumbHeight","sunburst","breadcrumbPoints","color"], function(d3,breadcrumbWidth,breadcrumbHeight,sunburst,breadcrumbPoints,color)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${breadcrumbWidth * 20} ${breadcrumbHeight}`)
    .style("font", "18px sans-serif")
    .style("margin", "5px");

  const g = svg
    .selectAll("g")
    .data(sunburst.sequence)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

  g.append("polygon")
    .attr("points", breadcrumbPoints)
    .attr("fill", d => color(d.data.name.substring(0, d.data.name.length-1)))
    .attr("stroke", "white");

  //---------------------------------------------------------------------------------
  g.append("text")
    .attr("x", (breadcrumbWidth + 10) / 2)
    .attr("y", 15)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("class", "breadcrumbText")
    .text(d => 
        d.data.name.substring(d.data.name.length - 1, d.data.name.length) == "s" ? d.data.name.substring(0, d.data.name.length - 1).toUpperCase() + " (S)" :
        d.data.name.substring(d.data.name.length - 1, d.data.name.length) == "b" ? d.data.name.substring(0, d.data.name.length - 1).toUpperCase() + " (B)" :
        d.data.name.substring(d.data.name.length - 1, d.data.name.length) == "f" ? d.data.name.substring(0, d.data.name.length - 1).toUpperCase() + " (F)" :
        d.data.name.substring(d.data.name.length - 1, d.data.name.length) == "x" ? d.data.name.substring(0, d.data.name.length - 1).toUpperCase() :
        d.data.name.substring(d.data.name.length - 1, d.data.name.length) == "i" ? d.data.name.substring(0, d.data.name.length - 1).toUpperCase() + " (IP)" : null);

    //d.data.name.substring(0, d.data.name.length-1)
  //---------------------------------------------------------------------------------

  svg
    .append("text")
    .text(sunburst.percentage > 0 ? sunburst.percentage + "%" : "")
    .attr("x", (sunburst.sequence.length + 0.5) * breadcrumbWidth)
    .attr("y", breadcrumbHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("class", "breadcrumbText")
    .attr("fill", "white");

  return svg.node();
}
);
  main.variable(observer("viewof sunburst")).define("viewof sunburst", ["partition","data","d3","radius","width","color","arc","mousearc"], function(partition,data,d3,radius,width,color,arc,mousearc)
{
  const root = partition(data);
  const svg = d3.create("svg");
  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = { sequence: [], percentage: 0.0 };

  //------------------------------------------------------------------------------
  var balls = 0;
  var strikes = 0;

  // Count Background
  svg.append("rect")
    .attr("class", "count")
    .attr("x", -415)
    .attr("y", -450)
    .attr("width", 95)
    .attr("height", 70)
    .attr("fill", "#79b8cd")
    .attr("rx", "15")
    .style("visibility", "hidden");

  // Count Text
  svg.append("text")
    .attr("class", "count")
    .attr("x", -400)
    .attr("y", -400)
    .attr("fill", "white")
    .text(balls + "-" + strikes)
    .style("visibility", "hidden");

  //------------------------------------------------------------------------------

  const label = svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("fill", "#FFFFFF")
    .style("visibility", "hidden");

  label
    .append("tspan")
    .attr("class", "percentage")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "-0.1em")
    .attr("font-size", "3em")
    .text("");

  /*label
    .append("tspan")
    .attr("class", "tspanText")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "1.5em")
    .text("at bats start with this sequence");*/

    label
        .append("tspan")
        .attr("class", "tspanText")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "1.5em")
        .text("of at-bats start with this sequence");    

  svg
    .attr("viewBox", `${-radius} ${-radius} ${width} ${width}`)
    .style("max-width", `${width}px`)
    .style("font", "12px sans-serif");

  const path = svg
    .append("g")
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("fill", d => color(d.data.name.substring(0, d.data.name.length-1)))
    .attr("d", arc);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseleave", () => {
      path.attr("class", "fadeIn");
      label.style("visibility", "hidden");
      // Update the value of this view
      element.value = { sequence: [], percentage: 0.0 };
      element.dispatchEvent(new CustomEvent("input"));
      //----------------------------------------------------------------
      d3.selectAll(".count").style("visibility", "hidden");
      //-----------------------------------------------------------------
    })
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("d", mousearc)
    .on("mouseenter", (event, d) => {
      // Get the ancestors of the current segment, minus the root
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      /*path.attr("fill-opacity", node =>
        sequence.indexOf(node) >= 0 ? 1.0 : 0.3
      );*/
      //--------------------------------------------------------------
      strikes = 0;
      balls = 0;
      for (var i = 1; i < sequence.length; i++) {
        if (sequence[i].data.name.substring(sequence[i].data.name.length - 1, sequence[i].data.name.length) == "s") {
          strikes++;
        } else if (sequence[i].data.name.substring(sequence[i].data.name.length - 1, sequence[i].data.name.length) == "b") {
          balls++;
        } else if ((sequence[i].data.name.substring(sequence[i].data.name.length - 1, sequence[i].data.name.length) == "f") && (strikes <= 1)){
          strikes++;
        }
      }
      d3.selectAll(".count").text(balls + "-" + strikes).style("visibility", "visible");

      path.attr("class", node => 
        sequence.indexOf(node) >= 0 ? "fadeIn" : "notChild"
      );
      label.select(".tspanText").text(node => 
        sequence[sequence.length - 1].depth == 1 ? "of your at-bats are " 
            + sequence[0].data.name.substring(0, sequence[0].data.name.length-1) + "'s" : "of your at-bats start with this sequence"
      );
      label.select(".tspanText").style("font-size", node => 
        sequence[sequence.length - 1].depth == 1 ? "20px" : "15px"
      );

      //-----------------------------------------------------------------

      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style("visibility", null)
        .select(".percentage")
        .text(percentage + "%");
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = { sequence, percentage };
      element.dispatchEvent(new CustomEvent("input"));
    });


  return element;
}
);
  main.variable(observer("sunburst")).define("sunburst", ["Generators", "viewof sunburst"], (G, _) => G.input(_));
  
  main.variable(observer("csv")).define("csv", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParseRows(await FileAttachment("visit-sequences@1.csv").text())
)});
  main.variable(observer("data")).define("data", ["buildHierarchy","csv"], function(buildHierarchy,csv){return(
buildHierarchy(csv)
)});
  main.variable(observer("partition")).define("partition", ["d3","radius"], function(d3,radius){return(
data =>
  d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  )
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  //-----------------------------------------------------------------------------------------
  .domain(["fastball", "changeup", "slider", "strikeout", "flyout", "curveball", "groundout", "single", "double", "triple", "homer"])
  .range(["#79b8cd", "#64c3e2", "#4fcef7", "#a0e8a0", "#81e081", "#8eaeb8", "#61d961", "#ffb0b0", "#ff8989", "#ff6262", "#ff3b3b"])
  //--------------------------------------------------------------------------------------------
)});
  main.variable(observer("width")).define("width", function(){return(
1000
)});
  main.variable(observer("radius")).define("radius", ["width"], function(width){
    return(
      width / 2
    )
  });
  main.variable(observer("arc")).define("arc", ["d3","radius"], function(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(1 / radius)
  .padRadius(radius)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(d => Math.sqrt(d.y1) - 1)
)});
  main.variable(observer("mousearc")).define("mousearc", ["d3","radius"], function(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(radius)
)});
  main.variable(observer("buildHierarchy")).define("buildHierarchy", function(){return(
function buildHierarchy(csv) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: "root", children: [] };
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0];
    const size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split("-");
    let currentNode = root;
    for (let j = 0; j < parts.length; j++) {
      const children = currentNode["children"];
      const nodeName = parts[j];
      let childNode = null;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size };
        children.push(childNode);
      }
    }
  }
  return root;
}
)});
  main.variable(observer("breadcrumbWidth")).define("breadcrumbWidth", function(){return(
160
)});
  main.variable(observer("breadcrumbHeight")).define("breadcrumbHeight", function(){return(
40
)});
  main.variable(observer("breadcrumbPoints")).define("breadcrumbPoints", ["breadcrumbWidth","breadcrumbHeight"], function(breadcrumbWidth,breadcrumbHeight){return(
function breadcrumbPoints(d, i) {
  const tipWidth = 10;
  const points = [];
  points.push("0,0");
  points.push(`${breadcrumbWidth},0`);
  points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
  points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
  points.push(`0,${breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(" ");
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
