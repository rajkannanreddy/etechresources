/**
 * Create an <svg> element and draw a pie chart into it.
 * Arguments:
 *   data: an array of numbers to chart, one for each wedge of the pie.
 *   width,height: the size of the SVG graphic, in pixels
 *   cx, cy, r: the center and radius of the pie
 *   colors: an array of HTML color strings, one for each wedge
 *   labels: an array of labels to appear in the legend, one for each wedge
 *   lx, ly: the upper-left corner of the chart legend
 * Returns: 
 *    An <svg> element that holds the pie chart.
 *    The caller must insert the returned element into the document.
 */
	
function pieChart(data, width, height, cx, cy, r, colors, labels, lx, ly) {

	var segmentShowStroke = true;
        segmentStrokeColor = "#fff";
        segmentStrokeWidth = 1;
        baseColor= "#fff";
        baseOffset= 15;
        edgeOffset= 30;//offset from edge of $this
        pieSegmentGroupClass= "pieSegmentGroup";
        pieSegmentClass= "pieSegment";
        lightPiesOffset= 12;//lighten pie's width
        lightPiesOpacity= .3;//lighten pie's default opacity
        lightPieClass= "lightPie";
        animation = true;
        animationSteps = 90;
        animationEasing = "easeInOutExpo";
        tipOffsetX= -15;
        tipOffsetY= -45;
        tipClass= "pieTip";
        beforeDraw= function(){  };
        afterDrawed = function(){  };
        onPieMouseenter = function(e,data){  };
        onPieMouseleave = function(e,data){  };
        onPieClick = function(e,data){  };

	var $groups = [],
    $pies = [],
    $lightPies = [];
    // This is the XML namespace for svg elements
    var svgns = "http://www.w3.org/2000/svg";    // Create the <svg> element, and specify pixel size and user coordinates
    var chart = document.createElementNS(svgns, "svg:svg");
    chart.setAttribute("width", width);
    chart.setAttribute("height", height);
    chart.setAttribute("viewBox", "0 0 " + width + " " + height);

    // Add up the data values so we know how big the pie is
    var total = 0;
    for(var i = 0; i < data.length; i++) total += data[i];
    
    // Now figure out how big each slice of pie is. Angles in radians.
    var angles = []
    for(var i = 0; i < data.length; i++) angles[i] = data[i]/total*Math.PI*2;

  //Set up pie segments wrapper
    var pathGroup = document.createElementNS(svgns, 'g');
    var $pathGroup = $(pathGroup).appendTo($(chart));
   // $pathGroup[0].setAttribute("opacity",0);
    
    var $tip = $('<div class="pieTip"/>').appendTo('body').hide(),
    tipW = $tip.width(),
    tipH = $tip.height();
    
    // Loop through each slice of pie.
    startangle = 0;
    for(var i = 0; i < data.length; i++) {
        // This is where the wedge ends
        var endangle = startangle + angles[i];

        // Compute the two points where our wedge intersects the circle
        // These formulas are chosen so that an angle of 0 is at 12 o'clock
        // and positive angles increase clockwise.
        var x1 = cx + r * Math.sin(startangle);
        var y1 = cy - r * Math.cos(startangle);
        var x2 = cx + r * Math.sin(endangle);
        var y2 = cy - r * Math.cos(endangle);
        
        var x11 = cx + (r+5) * Math.sin(startangle);
        var y11 = cy - (r+5) * Math.cos(startangle);
        var x22 = cx + (r+5) * Math.sin(endangle);
        var y22 = cy - (r+5) * Math.cos(endangle);

        
        // This is a flag for angles larger than than a half circle
        // It is required by the SVG arc drawing component
        var big = 0;
        if (endangle - startangle > Math.PI) big = 1;
        
        var g = document.createElementNS(svgns, 'g');
        g.setAttribute("data-order", i);
        g.setAttribute("class", pieSegmentGroupClass);
        $groups[i] = $(g).appendTo($pathGroup);
        $groups[i]
          .on("mouseenter", pathMouseEnter)
          .on("mouseleave", pathMouseLeave)
          .on("mousemove", pathMouseMove)
          .on("click", pathClick);
        
        // We describe a wedge with an <svg:path> element
        // Notice that we create this with createElementNS()
        var path = document.createElementNS(svgns, "path");
        
        // This string holds the path details
        var d = "M " + cx + "," + cy +  // Start at circle center
            " L " + x1 + "," + y1 +     // Draw line to (x1,y1)
            " A " + r + "," + r +       // Draw an arc of radius r
            " 0 " + big + " 1 " +       // Arc details...
            x2 + "," + y2 +             // Arc goes to to (x2,y2)
            " Z";                       // Close path back to (cx,cy)

        // Now set attributes on the <svg:path> element
        path.setAttribute("d", d);              // Set this path 
        path.setAttribute("fill", colors[i]);   // Set wedge color
        path.setAttribute("stroke", "white");   // Outline wedge in black
        path.setAttribute("stroke-width", "1"); // 2 units thick
        $pies[i] = $(path).appendTo($groups[i]);
        //chart.appendChild(path);                // Add wedge to chart
        $pathGroup[0].setAttribute("opacity",1);
        var lp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // This string holds the path details
        var lpd = "M " + cx + "," + cy +  // Start at circle center
            " L " + x11 + "," + y11 +     // Draw line to (x1,y1)
            " A " + r + "," + r +       // Draw an arc of radius r
            " 0 " + big + " 1 " +       // Arc details...
            x22 + "," + y22 +             // Arc goes to to (x2,y2)
            " Z";                       // Close path back to (cx,cy)

        // Now set attributes on the <svg:path> element
        lp.setAttribute("d", lpd);              // Set this path 

        lp.setAttribute("stroke-width", segmentStrokeWidth);
        lp.setAttribute("stroke", segmentStrokeColor);
        lp.setAttribute("stroke-miterlimit", 2);
        lp.setAttribute("fill", colors[i]);
        lp.setAttribute("opacity", lightPiesOpacity);
        lp.setAttribute("class", lightPieClass);
        $lightPies[i] = $(lp).appendTo($groups[i]);
        // The next wedge begins where this one ends
        startangle = endangle;

        // Now draw a little matching square for the key
        var icon = document.createElementNS(svgns, "rect");
        icon.setAttribute("x", lx);             // Position the square
        icon.setAttribute("y", ly + 30*i);
        icon.setAttribute("width", 20);         // Size the square
        icon.setAttribute("height", 20);
        icon.setAttribute("fill", colors[i]);   // Same fill color as wedge
        icon.setAttribute("stroke", "black");   // Same outline, too.
        icon.setAttribute("stroke-width", "1");
        chart.appendChild(icon);                // Add to the chart

        // And add a label to the right of the rectangle
        var label = document.createElementNS(svgns, "text");
        label.setAttribute("x", lx + 30);       // Position the text
        label.setAttribute("y", ly + 30*i + 18);
        // Text style attributes could also be set via CSS
        label.setAttribute("font-family", "sans-serif");
        label.setAttribute("font-size", "16");
        // Add a DOM text node to the <svg:text> element
        label.appendChild(document.createTextNode(labels[i]));
        chart.appendChild(label);               // Add text to the chart
    }

   
function pathMouseEnter(e){
    var index = $(this).data().order;
    $tip.text(labels[index] + ": " + data[index]).fadeIn(200);
    if ($groups[index][0].getAttribute("data-active") !== "active"){
      $lightPies[index].animate({opacity: .8}, 180);
    }
    onPieMouseenter.apply($(this),[e,data]);
  }
  function pathMouseLeave(e){
    var index = $(this).data().order;
    $tip.hide();
    if ($groups[index][0].getAttribute("data-active") !== "active"){
      $lightPies[index].animate({opacity: lightPiesOpacity}, 100);
    }
    onPieMouseleave.apply($(this),[e,data]);
  }
  function pathMouseMove(e){
    $tip.css({
      top: e.pageY + tipOffsetY,
      left: e.pageX - $tip.width() / 2 + tipOffsetX
    });
  }
  function pathClick(e){
    var index = $(this).data().order;
    var targetGroup = $groups[index][0];
    for (var i = 0, len = data.length; i < len; i++){
      if (i === index) continue;
      $groups[i][0].setAttribute("data-active","");
      $lightPies[i].css({opacity: lightPiesOpacity});
    }
    if (targetGroup.getAttribute("data-active") === "active"){
      targetGroup.setAttribute("data-active","");
      $lightPies[index].css({opacity: .8});
    } else {
      targetGroup.setAttribute("data-active","active");
      $lightPies[index].css({opacity: 1});
    }
    onPieClick.apply($(this),[e,data]);
  }
  
  return chart;
}
