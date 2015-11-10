
	var app = angular.module('astro-app');
	app.service('BackendService', backendService);
	app.service('GraphService', graphService);
	app.service('GaugeService', gaugeService);

	function backendService($q) {
		var self = this;

		self.getOverviewData = function() {
			var defer = $q.defer();
			defer.resolve(overviewData.data);
			return defer.promise;
		};
	};

	function graphService() {
        var self = this;

		var COLORS = ['#027bb4', '#dbdbdb'];

        self.drawGraph = function(id, data) {
        	return $('#' + id).highcharts(graphConfig(data));
        };

        self.drawHistory = function(id, data) {
        	return $('#' + id).highcharts(historyConfig(data));
        };

        function getXaxisData(data) {
        	var values = [];
        	var outputFormat = 'YYYY-MM-DD';

        	if (data.metricSeries[0].info.updateSchedule == 'HOURLY') {
        		outputFormat = 'HH';
        	} else if (data.metricSeries[0].info.updateSchedule == 'DAILY') {
        		outputFormat = 'DD-MMM';
        	} else if (data.metricSeries[0].info.updateSchedule == 'MONTHLY') {
        		outputFormat = 'MMM';
        	}

        	for (var i=0; i < data.metricSeries[0].values.length; i++) {
        		values.push(moment(data.metricSeries[0].values[i].date.slice(0, 19), 'YYYY-MM-DDTHH:mm:ss').format(outputFormat));
        	};
        	return values;
        };

        function getYaxisData(data) {
        	var values = [];
        	var x;
        	for (var i=0; i < data.metricSeries.length; i++) {
        		values[i] = {
        			name: data.metricSeries[i].info.name,
        			color: COLORS[i],
        			zIndex: data.metricSeries.length - i,
        			data: []
        		};

        		// if series has first value, use series
        		// else generate a random one
        		if (data.metricSeries[i].values[0].value) {
                	for (var j=0; j < data.metricSeries[i].values.length; j++) {
                		values[i].data.push(data.metricSeries[i].values[j].value ? data.metricSeries[i].values[j].value : 0);
               		}
        		}
        		else {
                	for (var j=0; j < data.metricSeries[i].values.length; j++) {
                		values[i].data.push(Number((Math.random() * 1000).toFixed(0)));
               		}
        		}
        	}
        	return values;
        };

        function graphConfig(data) {
        	var graphObj = {
        		chart: {
        			marginTop: 70
        		},
        		credits: {
        			enabled: false
        		},
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
        		legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    x: -7,
                    y: 18,
                    symbolWidth: 10,
                    itemStyle: {
                    	"fontSize": "11px",
                    	"fontWeight": "normal"
                    }
                },
                xAxis: {
                    categories: getXaxisData(data),
                    lineColor: '#E7E7E7',
                    gridLineColor: '#E7E7E7',
                    tickColor: '#E7E7E7'
                },
                yAxis: {
        			alternateGridColor: '#ffffff',
                    gridLineColor: '#E7E7E7',
                    lineColor: '#E7E7E7',
                    tickColor: '#E7E7E7',
                    title: { text: ''},
                    labels: {
                        formatter: function () {
                        	if (this.value >= 1000000) {
                        		return Number(this.value / 1000000).toFixed(1) + 'M';
                        	}
                        	if (this.value >= 1000) {
                        		return Number(this.value / 1000).toFixed(1) + 'K';
                        	}
                            return this.value;
                        }
                    }
                },
                tooltip: {
                    crosshairs: false,
                    shared: false
                },
        		plotOptions: {
    				series: {
    					animation: false,
    					enableMouseTracking: false,
    					marker: {
    						enabled: true,
    						fillColor: 'white',
    						lineColor: undefined,
    						lineWidth: 3,
    						symbol: 'circle'
    					},
    					lineWidth: 3
    				}
        		},
        		series: getYaxisData(data)
        	};

        	/*var screenWidth = angular.element(screen.width)[0];
        	if (screenWidth <= 420) {
        		graphObj.options.chart.type = 'column';
        		graphObj.subtitle.text = "Column chart for screen width <= 420";
        	}*/
        	return graphObj;
        };

        function historyConfig(data) {

        	var values = [];
        	for (var i=0; i < data.length; i++) {
        		values.push(Number(data[i].value));
        	}

        	var graphObj = {
        		chart: {
        			backgroundColor: '#027BB4',
        			type: 'line'
        		},
        		credits: {
        			enabled: false
        		},
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
        		legend: {
                    enabled: false
                },
                xAxis: {
                    visible: false
                },
                yAxis: {
                    visible: false
                },
                tooltip: {
                    enabled: false
                },
        		plotOptions: {
    				series: {
    					animation: false,
    					enableMouseTracking: false,
    					marker: {
    						enabled: true,
    						fillColor: '#027BB4',
    						lineColor: 'white',
    						lineWidth: 3,
    						symbol: 'circle'
    					},
    					lineWidth: 3
    				}
        		},
        		series: [{  		
        			lineColor: 'white',
        			data: values
        		}]
        	};

        	return graphObj;
        };
	};

	function gaugeService() {
		var self = this;

		var map = {};

		var COLORS = {
			'BLUE': '#027bb4',
			'GREEN': '#5ca946',
			'YELLOW': '#fcb134',
			'RED': '#dd0303',
			'GRAY': '#727272'
		};

		self.draw = function(elementId, gauge) {
			var min = gauge.minValue;

			var data = {
				min: gauge.minValue - min,
				max: gauge.maxValue - min,
				label: {
					min: formatGaugeValue(gauge.minValue),
					max: formatGaugeValue(gauge.maxValue)
				},
				value: gauge.metric.value.value > min ? gauge.metric.value.value - min : gauge.metric.value.value,
				direction: gauge.direction,
				color: COLORS[gauge.metric.value.status]
			};

			var options = { gauge: {} };
			if (gauge.thresholds) {
				options.gauge.type = 'threshold';
				options.gauge.threshold = [];

				// first value
				options.gauge.threshold.push({
					start: 0,
					end: Math.floor((gauge.thresholds[0].value - min) * 100 / (gauge.maxValue - min)),
					color: COLORS[gauge.startWithStatus]
				});

				for (var i=0; i < gauge.thresholds.length; i++) {
					options.gauge.threshold.push({
						start: Math.floor((gauge.thresholds[i].value - min) * 100 / (gauge.maxValue - min)),
						end: (i == gauge.thresholds.length-1) ? 100 : Math.floor((gauge.thresholds[i+1].value - min) * 100 / (gauge.maxValue - min)),
						color: COLORS[gauge.thresholds[i].status]
					});
				}
			}
			else {
				options.gauge.type = 'single';
				options.gauge.single = { color: COLORS[gauge.startWithStatus] };
			}

			return new Gauge().create(elementId, data, options);
		};

		function formatGaugeValue(value) {
			if (value >= 1000000) {
				return (value / 1000000).toFixed(0) + 'M';
			}
			if (value >= 1000) {
				return (value / 1000).toFixed(0) + 'K';
			}
			return value;
		};

	};