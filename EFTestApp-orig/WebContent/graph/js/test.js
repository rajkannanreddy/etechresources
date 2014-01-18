/*  http://coding.smashingmagazine.com/2011/09/23/create-an-animated-bar-graph-with-html-css-and-jquery/ */
$(document).ready(function() {
	var testVar=null;
	var yAxisMarkings = 5, measure = 'B', currency = '$', measureName='Billions';
	var chartData = []; columnGroups = []; chartHeading = []; chartLegend = []; xLegend	= []; yLegend= [], chartYMax = 0, chartWidth=0;


	$("[id^=data-table-").each(function(index) {
		var data = $('#data-table-'+index), container = $('.chart-'+index);
		chartData = []; columnGroups = []; chartHeading = []; chartLegend = []; xLegend	= []; yLegend= []; chartYMax = 0;
		
		getData(data);
		createGraph(data, container, index);
	});

	function createGraph(data, container, indexWidth) {
		var bars = [], barTimer = 0, graphTimer = 0;		
				
		var graphContainer = $('<div class="graph"></div>');
		var yLegendContainer = $('<div  class="yLegendContainer"></div>');
		var gbContainer = $('<div class="gb"></div>');
		var barContainer = $('<div class="bars"></div>');		
		var xAxisList	= $('<ul class="x-axis"></ul>');
		var yAxisList	= $('<ul class="y-axis"></ul>');		

		var heading = $('<h4>' + chartHeading + '</h4>');
		heading.appendTo(graphContainer);

		xAxisList = appendListData(xLegend, xAxisList);
		yAxisList = appendListData(yLegend, yAxisList);

		$('<span>Billions</span>').appendTo(yLegendContainer);

		var lheight = chartLegend.length > 3 ? '60px' : '30px'; 
		var legendList	= $('<ul class="legend" style="height: '+lheight+';"></ul>');
		legendList = appendListDataWithClass('class="icon fig', chartLegend, legendList);

		$(data).css('display', 'none');
		$(container).css('height', '90%');
		chartWidth = ($(container).width()*90/100);
		
		$.each(columnGroups, function(index) {
			var barGroup = $('<div class="bar-group"></div>');
			var columnGroupsLenght = columnGroups[index].length;
			var barWidth = (chartWidth - (xLegend.length * 31))/(columnGroupsLenght * xLegend.length);

			for (var j = 0, k = columnGroupsLenght; j < k; j++) {
				var barObj = {};
				var barLabel = this[j];

				label = barLabel>0?(currency +' ' +barLabel+ ' '+ measure):("("+currency +' ' +Math.abs(barLabel)+ ' '+ measure+")");

				barObj.height = Math.floor((Math.abs(barLabel) / chartYMax) * 100) + '%';
				barObj.width = barWidth;
				barObj.figWidth = (j==0)?0:(barWidth+1)*j;	

				barObj.bar = $('<div class="bar fig' + j + '"><span class="fig'+ j +'">'+ label + '</span></div>').appendTo(barGroup);
				bars.push(barObj);				
			}
			barGroup.appendTo(barContainer);
		});

		yLegendContainer.appendTo(graphContainer);
		yAxisList.appendTo(graphContainer);		
		barContainer.appendTo(gbContainer);	
		xAxisList.appendTo(gbContainer);
		legendList.appendTo(gbContainer);
		gbContainer.appendTo(graphContainer);
		graphContainer.appendTo(container);

		function displayGraph(bars, i) {			
			if (i < bars.length) {
				$(bars[i].bar).animate({
					height: bars[i].height					
				}, 0);
				$(bars[i].bar.css("width", bars[i].width));
				$(bars[i].bar.css("left", bars[i].figWidth));
				barTimer = setTimeout(function() {
					i++;				
					displayGraph(bars, i);
				}, 0);
			}
		}

		function resetGraph() {
			$.each(bars, function(i) {
				$(bars[i].bar).stop().css('height', 0);
			});			
			clearTimeout(barTimer);
			clearTimeout(graphTimer);			
			graphTimer = setTimeout(function() {		
				displayGraph(bars, 0);
			}, 20);
		}
		resetGraph();
	}	

	function printData(data){
		var returnData = "";
		$.each(data, function( index ) {  
			index==0 ? returnData = data[index] : returnData = returnData + " : "+data[index];
		});
		return returnData;
	}

	function getYAxisData(chartData) {
		chartYMax = Math.ceil(Math.max.apply(Math, chartData));
		var yLegend = [];
		for (var i = 0; i < yAxisMarkings; i++) {
			yLegend.unshift(((chartYMax * i) / (yAxisMarkings - 1)));
		}
		return yLegend;
	}

	function getSimpleTagValue (data, searchTag) {
		return (data.find(searchTag).text());
	}

	function appendListData(data, parent) {
		$.each(data, function( value ) {  
			$('<li><span>' + value + '</span></li>').appendTo(parent);
		});
		return parent;
	}

	function appendListDataWithClass(classDef, data, parent) {
		$.each(data, function( index, value ) {  
			$('<li><span '+classDef + index + '"></span>' + value + '</li>').appendTo(parent);
		});
		return parent;
	}

	function getData(data){
		if ((data.find('thead').length) > 0){
			data.find('thead tr:eq(0)').each(function() {
				($(this).find('th')).each(function(idx) {
					(idx > 0) ? (xLegend.push($(this).text()), columnGroups[idx-1] = []) : "";
				});		  
			});
			data.find('tbody tr').each(function() {
				$(this).find('td').each(function(idx) {
					var tdValue = $(this).text();
					(idx == 0) ? (chartLegend.push(tdValue)) : (chartData.push(tdValue), columnGroups[idx-1].push(tdValue));
				});
			});
		}else{
			data.find('tr').each(function(index) {
				$(this).find('td').each(function(idx) {
					var tdValue = $(this).text();
					(index == 0) ? ((idx > 0) ? (columnGroups[idx-1] = [], xLegend.push(tdValue)) : "") : (idx==0 ? chartLegend.push(tdValue) : (chartData.push(tdValue), columnGroups[idx-1].push(tdValue)));
				});
			});
		}

		chartHeading = getSimpleTagValue(data, 'caption');
		yLegend	= getYAxisData(chartData);
		//$('#msg').html("xLegend : "+printData(xLegend)+ "<br /> CharLegend : "+printData(chartLegend)+ "<br /> ChartData :"+printData(chartData)+"<br /> ColumnGroup :"+printData(columnGroups));
	}
});
