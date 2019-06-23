var accidenttypes = new Array();
var accidentdate = new Array();
var accidentmonth = new Array();
function echartquery(){
	map.removeInteraction(drawpoint);
	map.removeInteraction(drawcircle);
	map.removeInteraction(drawpoint_add);
	map.removeInteraction(drawpoint_updata);
	map.removeInteraction(drawp);
	var struct = new Zondy.Service.QueryFeatureStruct({
		IncludeAttribute: true,
		IncludeGeometry: true,
		IncludeWebGraphic: true
	})
	//创建查询参数
	var queryParam = new Zondy.Service.QueryParameter({
		recordNumber: 100,
		struct: struct,
		resultFormat: "json"
	})
	var queryDocFeature = new Zondy.Service.QueryDocFeature(queryParam, '光谷智慧交通', 3, {
		ip: '127.0.0.1',
		port: '6163'
	});
	queryDocFeature.query(chsuccess, cherror);
}
Array.prototype.in_array = function (element) { 
　　for (var i = 0; i < this.length; i++) { 
　　if (this[i] == element) { 
　　return true; 
   } 
  } return false;  
} 
function getChart(){
	var box = document.getElementById("box");
	box.style = "height: 350px";
	var myChart = echarts.init(document.getElementById("box"));
	var barxValue = new Array();
	var baryValue = new Array();
	var sltmo = document.getElementById("sltmo");
	var index = sltmo.selectedIndex;
	var value = sltmo.options[index].value;
	var tyslt = document.getElementById("tyslt");
	var index2 = tyslt.selectedIndex;
	var value2 = tyslt.options[index2].text;
	for(var i=0; i<accidentmonth.length; i++){
		if(accidentmonth[i]==value){
			if(!barxValue.in_array(accidenttypes[i])){
				barxValue.push(accidenttypes[i]);
				baryValue.push('0');
			}
		}
	}
	for(var i=0; i<accidentmonth.length; i++){
		if(accidentmonth[i]==value){
			for(var j=0; j<barxValue.length; j++){
				if(barxValue[j] == accidenttypes[i]){
					baryValue[j]++;
				}
			}
		}
	}
	if(value2=="柱状图") {
		var option = {
			title: {
				text: value + '月事件柱状统计图',
				left: 'center'
			},
			xAxis: {
				type: 'category',
				data: barxValue,
				axisTick: {
					alignWithLabel: true
				}
			},
			yAxis: {
				name: '次数',
				type: 'value'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			series: [{
				data: baryValue,
				type: 'bar'
			}]
		};
	}else{
		var data = new Array();
		for(var i=0; i<barxValue.length; i++){
			var str = {value:baryValue[i], name:barxValue[i]};
			data.push(str);
		}
		var option = {
			title: {
				text: value + '月事件饼状统计图',
				left: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
        		orient: 'vertical',
        		left: 'left',
        		data: barxValue
    		},						
			series: [{
				data: data,
				name: '次数',
				type: 'pie'
			}]
		};
	}
	//清除上一次数据缓存
	myChart.clear();
	//开始制图
	myChart.setOption(option);
}
function chsuccess(data){
	var SFEleArray = data.SFEleArray;
	for(var i=0; i<SFEleArray.length; i++){
		accidenttypes.push(SFEleArray[i].AttValue[1]);
		accidentdate.push(SFEleArray[i].AttValue[3]);
		var s = SFEleArray[i].AttValue[3].split('.');
		accidentmonth.push(Number(s[1]));
	}
	
	var view = map.getView();
	center = view.getCenter();
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
  	var closer = document.getElementById('popup-closer');
  	var str = '<div align="center" style="width: 400px;">请选择月份：<select id="sltmo" onchange="getChart()"><option value="1">一月</option><option value="2">二月</option><option value="3">三月</option><option value="4">四月</option><option value="5">五月</option><option value="6">六月</option><option value="7">七月</option><option value="8">八月</option><option value="9">九月</option><option value="10">十月</option><option value="11">十一月</option><option value="12">十二月</option></select>&nbsp;<select id="tyslt" onchange="getChart()"><option>柱状图</option><option>饼图</option></select><div id="box"></div></div>';
  	content.innerHTML = str;
  	popup = new ol.Overlay({
            //要转换成overlay的HTML元素
            element: container,
            //当前窗口可见
            autoPan: true,
            //Popup放置的位置
            positioning: 'bottom-center',
            //是否应该停止事件传播到地图窗口
            stopEvent: false,
            autoPanAnimation: {
                //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
                duration: 250
            }
       });
    map.addOverlay(popup);
	popup.setPosition([center[0]-0.02,center[1]-0.05]);
	closer.onclick = function() {
		//未定义popup位置
		popup.setPosition(undefined);
		//失去焦点
		closer.blur();
		return false;
	};
}
function cherror(data){
	alert("查询失败！！")
}
