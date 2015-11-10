
function Gauge() {
	this.renderer = null;
};

Gauge.prototype.delete = function() {
	if (this.renderer) this.renderer.destroy()
};

Gauge.prototype.create = function(element, data, options) {
	if (!element || typeof element != 'string') {
		return this;
	}

	if (!data || typeof data != 'object') {
		return this;
	}

	// local functions
	function drawArc(renderer, cx, cy, outerRadius, innerRadius, start, end, options) {
		var startAngle = - start  * Math.PI/180;
		var endAngle;
		var obj;

		if(end > 270){
			endAngle = (360 - end) * Math.PI/180;
		} else if (end >= 0 && end <= 270){
			endAngle = -end * Math.PI/180;
		}else if(end < 0){
			endAngle = Math.abs(end) * Math.PI/180;
		}

		obj = renderer.arc(cx, cy, outerRadius, innerRadius, startAngle, endAngle);
		addOptions(obj, options);
	};

	function drawArcCorner(renderer, x, y, radius, startAngle, endAngle, options) {
		var obj = renderer.circle(x, y, radius);
		addOptions(obj, options);
	};

	function drawTick(renderer, cx, cy, innerRadius, outerRadius, angle, options) {
		var x1 = cx + (innerRadius) * Math.cos((angle)*Math.PI/180), 
		y1 = cy + (innerRadius) * - Math.sin((angle)*Math.PI/180),
		x2 = cx + (outerRadius) * Math.cos((angle)*Math.PI/180), 
		y2 = cy + (outerRadius) * - Math.sin((angle)*Math.PI/180),

		obj = renderer.path(['M', x1, y1, 'L', x2, y2]);
		addOptions(obj, options);
	};

	function drawCircle(renderer, x, y, radius, options) {
		var obj = renderer.circle(x, y, radius);
		addOptions(obj, options);
	};

	function drawImage(renderer, direction, x, y, radius, options) {
		var src = './img/arrow.svg';
		if (direction == 'UP') {
			var src = './img/arrow.svg';
		}

		var obj = renderer.image(src, x - (radius/4), y - (radius/4), radius/2, radius/2);
		addOptions(obj, options);
	};

	function drawArrow(renderer, x, y, direction, options) {
		var arr = [];
		var x1, x2, y1, y2;

		// vertical line 
		if (direction == 'UP') {
			//y -= 2;
			y1 = y*0.81;
			y2 = y*1.12;
			arr = arr.concat(['M', x, y1, 'L', x, y2]);

			height = y2 - y1;
			x1 = x - (height/2);
			x2 = x + (height/2);

			y2 = y*0.97;
			arr = arr.concat(['M', x1, y2, 'L', x, y1]);
			arr = arr.concat(['M', x2, y2, 'L', x, y1]);
		} else {
			y += 2;
			y1 = y*0.81;
			y2 = y*1.12;
			arr = arr.concat(['M', x, y1, 'L', x, y2]);

			height = y2 - y1;
			x1 = x - (height/2);
			x2 = x + (height/2);

			y1 = y*0.97;
			arr = arr.concat(['M', x1, y1, 'L', x, y2]);
			arr = arr.concat(['M', x2, y1, 'L', x, y2]);
		}

		var obj = renderer.path(arr);
		addOptions(obj, options);
	};

	function drawText(renderer, str, x, y, options) {
		var obj = renderer.text(str, x, y);
		addOptions(obj, options);
	};

	var getAngleRangePerValue = function(min, max, value, startAngle, endAngle) {
		return ((max - min)/(value - min)) ? (360 - Math.abs(endAngle - startAngle))/((max - min)/(value - min)):0;
	};

	var getAngleForPoint = function(min, max, startAngle, endAngle) {
		return (360 - Math.abs(endAngle - startAngle))/(max - min);
	};

	var addOptions = function(obj, options) {
		var attr = {},
		group,
		css = {};

		$.each(options, function(key, value){
			if(key === 'attr'){
				$.each(value, function(subKey, subValue){
					attr[subKey]= subValue;
				});
			} else if (key === 'group') {
				group = value;
			} else if (key === 'css') {
				$.each(value, function(subKey, subValue){
					css[subKey]= subValue;
				});
			} else {
				throw new Error('Illegal options');
			}
		});

		if(!$.isEmptyObject(attr)){
			obj['attr'](attr);
		}

		if(!$.isEmptyObject(css)){
			obj['css'](css);
		}	

		if(typeof group === 'undefined'){
			obj.add();
		} else {
			obj.add(group);
		}
	};

	var DEFAULT_OPTIONS = {
		gauge: {
			stroke: {
				color: '#000000',
				width: '0'
			},
			type: 'threshold', // threshold or single
			single: {
				color: '#027bb4'
			},
			threshold: [{
				start: 0,
				end: 30,
				color: '#5ca946'
			},
			{
				start: 30,
				end: 70,
				color: '#fcb134'
			},
			{
				start: 70,
				end: 100,
				color: '#dd0303'
			}]
		},
		text: {
			color: '#727272',
			size: 12
		},
		tick: {
			color: '#000000',
			linecap: 'round',
			width: undefined
		},
		circle: {
			color: '#dbdbdb',
			fill: '#ffffff',
			width: undefined
		}
	};

	var opts = $.extend(true, {}, DEFAULT_OPTIONS, options);

	var container = document.getElementById(element);
	var height = (opts && opts.height) ? opts.height : container.clientHeight;
	var width = (opts && opts.width) ? opts.width : container.clientWidth;

	// destroy previous created gauge
	if (this.renderer) this.renderer.destroy();

	// create new gauge
	this.renderer = new Highcharts.Renderer(container, width, height);
	var group = this.renderer.g().add();

	// draw rectangle that will hold the gauge
	var obj = this.renderer.rect(0, 0, width, height);
	obj.group = group;

	// draw arc with rounded corners
	var startAngle = 225;
	var endAngle = 315;
	var cx = width/2;
	var cy = height/2;
	var radius = height > width ? cx * 0.85 : cy * 0.85;
	var innerRadius = radius * 0.85;

	if (opts.gauge.type == 'threshold') {
		var threshold;
		var start = startAngle;
		var end = endAngle;
		var point;

		for (var i=0; i < opts.gauge.threshold.length; i++) {
			threshold = opts.gauge.threshold[i];

			point = data.max * threshold.start / 100;
			start = startAngle - getAngleRangePerValue(data.min, data.max, point, startAngle, endAngle);

			point = data.max * threshold.end / 100;
			end = startAngle - getAngleRangePerValue(data.min, data.max, point, startAngle, endAngle);

			drawArc(this.renderer, cx, cy, radius, innerRadius, start, end, {
				'group': group,
				'attr': {
					'fill': threshold.color,
					'stroke': opts.gauge.stroke.color,
					'stroke-width': opts.gauge.stroke.width
				}
			});
		}
		drawArcCorner(this.renderer, cx + ((innerRadius + (radius - innerRadius)/2) * Math.cos((startAngle)*Math.PI/180)), cy + ((innerRadius + (radius - innerRadius)/2) * -Math.sin((startAngle)*Math.PI/180)), (radius - innerRadius)/2, startAngle, endAngle, {
			'group': group,
			'attr': {
				'fill': opts.gauge.threshold[0].color,
				'stroke': opts.gauge.stroke.color,
				'stroke-width': opts.gauge.stroke.width
			}
		});
		drawArcCorner(this.renderer, cx + ((innerRadius + (radius - innerRadius)/2) * Math.cos((endAngle)*Math.PI/180)), cy + ((innerRadius + (radius - innerRadius)/2) * -Math.sin((endAngle)*Math.PI/180)), (radius - innerRadius)/2, startAngle, endAngle, {
			'group': group,
			'attr': {
				'fill': opts.gauge.threshold[opts.gauge.threshold.length-1].color,
				'stroke': opts.gauge.stroke.color,
				'stroke-width': opts.gauge.stroke.width
			}
		});
	}
	else {
		drawArc(this.renderer, cx, cy, radius, innerRadius, startAngle, endAngle, {
			'group': group,
			'attr': {
				'fill': opts.gauge.single.color,
				'stroke': opts.gauge.stroke.color,
				'stroke-width': opts.gauge.stroke.width
			}
		});
		drawArcCorner(this.renderer, cx + ((innerRadius + (radius - innerRadius)/2) * Math.cos((startAngle)*Math.PI/180)), cy + ((innerRadius + (radius - innerRadius)/2) * -Math.sin((startAngle)*Math.PI/180)), (radius - innerRadius)/2, startAngle, endAngle, {
			'group': group,
			'attr': {
				'fill': opts.gauge.single.color,
				'stroke': opts.gauge.stroke.color,
				'stroke-width': opts.gauge.stroke.width
			}
		});
		drawArcCorner(this.renderer, cx + ((innerRadius + (radius - innerRadius)/2) * Math.cos((endAngle)*Math.PI/180)), cy + ((innerRadius + (radius - innerRadius)/2) * -Math.sin((startAngle)*Math.PI/180)), (radius - innerRadius)/2, startAngle, endAngle, {
			'group': group,
			'attr': {
				'fill': opts.gauge.single.color,
				'stroke': opts.gauge.stroke.color,
				'stroke-width': opts.gauge.stroke.width
			}
		});
	}

	// draw tick
	drawTick(this.renderer, cx, cy, radius*0.5, radius*1.1, startAngle - (getAngleForPoint(data.min, data.max, startAngle, endAngle) * (data.value - data.min)), {
		'group': group,
		'attr': {
			'stroke': opts.tick.color,
			'stroke-width': opts.tick.width ? opts.tick.width : (radius - innerRadius)*0.5,
			'stroke-linecap': opts.tick.linecap
		}
	});
	drawCircle(this.renderer, cx, cy, radius*0.5, {
		'group': group,
		'attr': {
			'fill': opts.circle.fill,
			'stroke': opts.circle.color,
			'stroke-width': opts.circle.width ? opts.circle.width : (radius - innerRadius)*0.8
		}
	});

	// draw arrow
	drawArrow(this.renderer, cx, cy, String(data.direction).toUpperCase(), {
		'group': group,
		'attr': {
			'stroke': data.color,
			'stroke-width': (radius - innerRadius)*0.6,
			'stroke-linecap': 'round'
		}
	});

	// draw labels
	drawText(this.renderer, data.label.min, cx + ((radius + width*0.1) * Math.cos((startAngle)*Math.PI/180)), cy + ((radius + height) * - Math.sin((startAngle)*Math.PI/180)), {
		'group': group,
		'attr': {
			'fill': opts.text.color,
			'text-anchor': 'middle',
			'font-size': opts.text.size ? opts.text.size : height*0.1
		}
	});
	drawText(this.renderer, data.label.max, cx + ((radius + width*0.1) * Math.cos((endAngle)*Math.PI/180)), cy + ((radius + height) * - Math.sin((endAngle)*Math.PI/180)), {
		'group': group,
		'attr': {
			'fill': opts.text.color,
			'text-anchor': 'middle',
			'font-size': opts.text.size ? opts.text.size : height*0.1
		}
	});

	return this;
};
