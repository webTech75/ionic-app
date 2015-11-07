
	var app = angular.module('astro-app');
	app.service('GraphService', graphService);
	app.service('GaugeService', gaugeService);

	function graphService() {
        var self = this;

        self.drawHistory = function(id) {
            var graphData = {
                chart: {
                    type: 'line',
                    marginTop: '10',
                    marginLeft:'10',
                    marginBottom: '10',
                    marginRight: "10"
                },
                title: {
                    text: ''
                },
                 legend: {
                    enabled: false
                },
                chart: {
                    link: false
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    visible: false
                },
                yAxis: {
                    visible: false
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    series: {
                        animation: false,
                        enableMouseTracking: false,
                        marker: {
                            enabled: true,
                            symbol: 'circle',
                            lineColor: 'black',
                            radius: 4,
                            lineWidth: 2
                        },
                        lineWidth: 3
                    }
                },
                series: [{
                    name: 'Tokyo',
                    data: [7.0, 7.5, 7, 7.5, 7.7]
                }]
            };

            var graph = $("#" + id).highcharts(graphData);
        };

        self.graphConfig = function(data) {
        	var graphObj = {
        		options: {
                	chart: {
                    	type: 'line',
                        marginTop: '2.5',
                        marginBottom: '0',
                        marginLeft:'10'
                	}
        		},
        		title: {
        			text: 'Number of Activations'
        		},
        		subtitle: {
        			text: 'Monthly'
        		},
        		xAxis: {
        			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        		},
        		yAxis: {
        			title: {
        				text: ''
        			},
        			labels: {
        				formatter: function() {
        					return this.value + '°';
        				}
        			}
        		},
        		tooltip: {
        			crosshairs: true,
        			shared: true
        		},
        		plotOptions: {
    				series: {
    					animation: false,
    					enableMouseTracking: false,
    					marker: {
    						enabled: true,
    						symbol: 'circle',
    						fillColor: 'white',
    						lineColor: undefined,
    						radius: 4,
    						lineWidth: 2
    					},
    					lineWidth: 3
    				},
    				column: {
        				marker: {
        					radius: 4,
        					lineColor: '#666666',
        					lineWidth: 1
        				}
        			}
        		},
        		series: data
        	};

        	var screenWidth = angular.element(screen.width)[0];
        	if (screenWidth <= 420) {
        		graphObj.options.chart.type = 'column';
        		graphObj.subtitle.text = "Column chart for screen width <= 420";
        	}
        	return graphObj;
        };
	};

	function gaugeService() {
		var self = this;

		var map = {};

		self.draw = function(elementId, data, options) {
			map[elementId] = new Gauge().create(elementId, data, options);
			return map[elementId];
		};

		self.erase = function(elementId) {
			if (map[elementId]) map[elementId].delete();
		}
	};