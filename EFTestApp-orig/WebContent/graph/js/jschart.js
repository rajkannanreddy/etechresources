/*  http://coding.smashingmagazine.com/2011/09/23/create-an-animated-bar-graph-with-html-css-and-jquery/ */
$(window).load(function() {
	var yAxisMarkings = 5, measure = 'B', currency = '$', measureName='Billions', xLength = 0; cLength = 0;
	var chartData = []; columnGroups = []; chartHeading = []; chartLegend = []; xLegend	= []; yLegend= [], chartYMax = 0, chartWidth=0;
	var $tip = "",
	onPieMouseenter = function(e){  },
    onPieMouseleave = function(e){  };
	
	    
	$("[id^=data-table-").each(function(index) {
		var data = $('#data-table-'+index), container = $('.chart-'+index);
		chartData = []; columnGroups = []; chartHeading = []; chartLegend = []; xLegend	= []; yLegend= []; chartYMax = 0;
		xLength = 0; cLength = 0;

		getData(data);
		createGraph(data, container, index);
	});

	function createGraph(data, container, indexWidth) {
		var bars = [];		

		var graphContainer = $('<div class="graph"></div>');
		var yLegendContainer = $('<div id="yLegendContainer"></div>');
		var gbContainer = $('<div class="gb"></div>');
		var barContainer = $('<div class="bars"></div>');		
		var xAxisList	= $('<ul class="x-axis" style="padding-bottom: 10px;padding-top: 2px;"></ul>');
		var yAxisList	= $('<ul class="y-axis"></ul>');
		var clearDiv = $('<div style="clear: both;"></div>');
		var legendList	= $('<ul class="legend"></ul>');
		
		$tip = $('<div class="pieTip"/>').appendTo('body').hide();

		var heading = $('<h4>' + chartHeading + '</h4>');
		heading.appendTo(graphContainer);

		xAxisList = appendListData(xLegend, xAxisList);
		yAxisList = appendListData(yLegend, yAxisList);
		$('<span>'+measureName+'</span>').appendTo(yLegendContainer);
		legendList = appendListDataWithClass('class="icon fig', chartLegend, legendList);

		$(data).css('display', 'none');
		$(container).css('height', '90%');

		chartWidth = ($(container).width()*(90/100));
		var count = 0;

		$.each(columnGroups, function(i) {
			var barGroup = $('<div class="bar-group"></div>');
			var columnGroupsLenght = columnGroups[i].length;
			var xLegendLength = xLegend.length;
			var barWidth =  Math.ceil((chartWidth - (xLegendLength * 31))/(columnGroupsLenght * xLegendLength));
			for (var j = 0; j < columnGroupsLenght; j++) {
				var barObj = {};
				var barLabel = this[j];

				label = (barLabel > 0) ? (currency +' ' +barLabel+ ' '+ measure) : ("("+currency +' ' +Math.abs(barLabel)+ ' '+ measure+")");

				barObj.height = Math.floor((Math.abs(barLabel) / chartYMax) * 100) + '%';
				barObj.width = Math.floor(Math.abs(barWidth));
				barObj.figWidth = Math.floor(Math.abs((j==0) ? 14 : (((barWidth+1) * j)+14)));	
				//alert(barWidth+" : "+barObj.figWidth+" : "+(((barWidth+1) * j)+14));
				barObj.spanText = xLegend[i] + "<br>" + chartLegend[j] +" : "+label;
				barObj.bar = $('<div data-order='+count+' class="bar fig' + j + '"></div>').appendTo(barGroup);
				bars.push(barObj);
				count++;
			}
			barGroup.appendTo(barContainer);
			
		});

		yLegendContainer.appendTo(graphContainer);
		yAxisList.appendTo(graphContainer);		
		barContainer.appendTo(gbContainer);	
		xAxisList.appendTo(gbContainer);
		clearDiv.appendTo(legendList);
		legendList.appendTo(gbContainer);
		gbContainer.appendTo(graphContainer);
		graphContainer.appendTo(container);

		getEqualXAxisWidth($(legendList).find('li'), indexWidth);
		$(yLegendContainer).find('span').css('width', ($(barContainer).height()));

		function displayGraph(bars, i) {			
			if (i < bars.length) {
				$(bars[i].bar)
		          .on("mouseenter", pathMouseEnter)
		          .on("mouseleave", pathMouseLeave)
		          .on("mousemove", pathMouseMove);
				var top = 0; left = 0;
				$(bars[i].bar).animate({
					height: bars[i].height,
					width: bars[i].width,
					left: bars[i].figWidth
				}, 0);
				//setSpanEvent($(bars[i].bar));
				setSpanWidth($(bars[i].bar));
				barTimer = setTimeout(function() {
					i++;				
					displayGraph(bars, i);
				}, 0);
			}
		}
		displayGraph(bars, 0);
		function pathMouseEnter(e){
			
		    var index = $(this).data().order;
		    //alert(index+" : ")
		    $tip.html(bars[index].spanText);
		    $tip.show();
		   // onPieMouseenter.apply($(this));
		  }
		  function pathMouseLeave(e){
		    var index = $(this).data().order;
		    $tip.hide();
		   // onPieMouseleave.apply($(this));
		  }
		  function pathMouseMove(e){
		    $tip.css({
		      top: e.pageY + (-50),
		      left: e.pageX - $tip.width() / 2 - 2
		    });
		  }

		
	}	

	function printData(data){
		var returnData = "";
		$.each(data, function( index ) {  
			index==0 ? returnData = data[index] : returnData = returnData + " : "+data[index];
		});
		return returnData;
	}
	
	function getWidth(data){
		alert($(data).width());
	}

	function setSpanEvent(data) {
		$(data).hover(function( event ) {
			//alert(event.clientY +" : "+ $(this).offset().top);
			$(this).find("span").css('top', (event.clientY));
			$(this).find("span").css('left', (event.clientX+8));
		});		
	}

	function setSpanWidth(data) {  
		var obj = $(data).find('span');
		$(obj).css('width', ($(obj).width()+2));
	}

	function getEqualXAxisWidth(group, indexWidth) {
		var totalLength = 0; tValue = []; modWidthValue = []; modTemp = 0; modTemp_test=0;
var testmsg ="";
		$.each(group, function( index ) {  
			
			var thisLength = Math.ceil(($(this)[0].getBoundingClientRect().width)-20); totalLength += thisLength; tValue[index] = thisLength;
			testmsg+= "CT : "+thisLength+" AL of"+index+" :"+tValue[index]+" TL: "+totalLength+" \n ";
			(totalLength + (index*20)) < chartWidth ? (modWidthValue[modTemp++] = 0) : "";
		});
		var modround = 1;
		for(var i=0;i<tValue.length;i++){		
			var mod = (i % modTemp);

			if(i!=0 && mod ==0){
				modround++;
			}
			if(modTemp > 1 && modWidthValue[mod] < tValue[i]){
				modWidthValue[mod] = tValue[i];
				if(modround > 1){
					modTemp_test = 0;
					var mLength =0;
					for(var j=0;j<modWidthValue.length;j++){
						mLength += modWidthValue[j];
						(mLength + ((j+1)*20)) < chartWidth ? modTemp_test++ : "";
					}	
					if(modTemp_test < modTemp){
						testI = i;
						modTemp--;
						i = i - (modTemp_test-2);
					}					
				}				
			}
		}

		if(modTemp != 1){
			$.each(group, function( index ) { 
				$(this).width(modWidthValue[(index % modTemp)]);
				testmsg += "FI "+index +":"	+modWidthValue[(index % modTemp)]+"\n";
				});
		}
		//alert(testmsg);
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
		$.each(data, function( index, value ) {  
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
					(idx > 0) ? (xLegend.push($(this).text()), columnGroups[idx-1] = [], (xLength += xLegend[idx-1].length)) : "";
				});		  
			});
			data.find('tbody tr').each(function(index) {
				$(this).find('td').each(function(idx) {
					var tdValue = $(this).text();
					(idx == 0) ? (chartLegend.push(tdValue), (cLength += chartLegend[index].length)) : (chartData.push(tdValue), columnGroups[idx-1].push(tdValue));
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
		// $('#msg').html("xLegend : "+printData(xLegend)+ "<br /> CharLegend :
		// "+printData(chartLegend)+ "<br /> ChartData
		// :"+printData(chartData)+"<br /> ColumnGroup
		// :"+printData(columnGroups));
	}
	
	
});
