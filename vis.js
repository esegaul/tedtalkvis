function plot_it()  {

	// dimensions
	var left_pad = 100, bottom_pad = 80;
	var lines_width = 1000, lines_height = 400;
	var right_pad = 25, y_pad = 40
	var lines_width = lines_width-(left_pad+right_pad), lines_height = lines_height-2*y_pad;

	// parameters for parallel coordinates appearance
	var normal_line_color = '#4575b4', normal_line_opacity = '0.1';
	var brushed_line_color = '#d73027', brushed_line_opacity = '0.7';

	/*
	*
	TOPICS BY YEAR PLOT
	*
	*/
	var year_keys = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]

	var svg = d3.select('body').append('svg').attr('width', 1700).attr('height', 1000).attr('transform', 'translate(5,5)')
	// group that will contain line plot (id: lines)
	d3.select('svg').append('g').attr('transform', 'translate('+left_pad+','+y_pad+')').attr('id', 'lines')
	// title
	d3.select('#lines').append('text').text('Topics By Year')
	.attr('transform', 'translate('+(lines_width/2)+',-15)').attr('text-anchor', 'middle').attr('fill', '#000').attr('font-size', '20px')
	// y-axis label
	d3.select('#lines').append('text').text('Number of Talks')
	.attr('transform', 'translate('+(-35)+','+(lines_height/2)+') rotate(270)').attr('text-anchor', 'middle').attr('fill', '#000')
	// x-axis label
	d3.select('#lines').append('text').text('Year')
	.attr('transform', 'translate('+(lines_width/2)+','+(lines_height +40 ) +')').attr('text-anchor', 'middle').attr('fill', '#000')
	// group that will contain y axis for our line plot (id: yaxis)
	d3.select('#lines').append('g').attr('id', 'yaxis')
	// group that will contain x axis for both our line plot and heatmap (id: xaxis)
	d3.select('#lines').append('g').attr('id', 'xaxis')

	var colors = ["#a6cee3",
		"#1f78b4",
		"#b2df8a",
		"#33a02c",
		"#fb9a99",
		"#e31a1c",
		"#fdbf6f",
		"#ff7f00",
		"#cab2d6",
		"#6a3d9a"]

	var count_max = 0;

	// sort talks by film_year
	ted_talk_data.sort((a, b) => (a.film_year > b.film_year) ? 1 : -1)

	var nested_data = d3.nest()
	.key(d => d.topic_pred_id)
	.key(d => d.film_year)
	.rollup(d => {
		count_max = Math.max(d.length, count_max)
		return d.length
	})
	.entries(ted_talk_data.filter(d => year_keys.includes(d.film_year)))

	// scales
	var x_scale = d3.scalePoint().domain(year_keys).range([0,lines_width]);
	var y_scale = d3.scaleLinear().domain([0, count_max]).range([lines_height,0]);
	var line = d3.line().x(d => x_scale(d.key)).y(d => y_scale(d.value))

	// display topic text and highlight topic text on mouseover
	function display_topic_text(d) {
		d3.select('#lines').append('text')
			.attr('class', 'topic')
			.attr('text-anchor', 'middle')
			.attr('fill', brushed_line_color)
			.attr('x', lines_width/2)
			.attr('y', 5)
			.text('Topic: ' + topic_groups[d.key])
		d3.selectAll('.x_text_' + d.key)
			.attr('fill', brushed_line_color)
	}

	// remove topic highlight and topic text highlight on mouseout
	function remove_topic_text(d) {
		d3.selectAll('.x_text_' + d.key)
			.attr('fill', 'black')
		d3.select('.topic').remove()
	}

	// data join
	var update_selection = d3.select('#lines').selectAll('.line_mark').data(nested_data)
	update_selection.enter().append('path')
		.attr('class', 'line_mark')
		.attr('d', d => {
			return line(d.values)
		})
		.attr('fill', 'none')
		.attr('stroke', d => colors[d.key])
		.attr('stroke-width', '3')
		.attr('opacity', '1')

		d3.select('#lines').selectAll('.line_mark')
			.on('mouseover', function(d) {
				d3.select(this).raise()
					.attr('stroke-width', '5')
				display_topic_text(d);
			})
			.on('mouseout', function(d) {
				d3.select(this)
					.attr('stroke-width', '3')
				remove_topic_text(d);
			});

	// axes
	d3.select('#lines').select('#xaxis')
	.attr('transform', 'translate('+'0'+','+ lines_height+')')
	.call(
		d3.axisBottom(x_scale)
		.tickValues(year_keys)
	)

	var yaxis = d3.select('#lines').select('#yaxis')
		.attr('id', 'leftaxis')

	yaxis.call(
		d3.axisLeft(y_scale))

	/*
	*
	PARALLEL COORDINATES PLOT
	*
	*/
	var parallel_width = lines_width, parallel_height = lines_height;

	// define topic groups for x-axis
	topic_groups = [['father', 'god', 'war', 'girl', 'parents'],
									['music', 'sound', 'playing', 'sounds', 'audience'],
									['species', 'animals', 'planet', 'sea', 'animal'],
									['cancer', 'disease', 'medical', 'blood', 'hospital'],
									['africa', 'economic', 'companies', 'economy', 'china'],
									['computer', 'machine', 'internet', 'digital', 'computers'],
									['cities', 'car', 'cars', 'street', 'driving'],
									['universe', 'theory', 'sun', 'planet', 'black'],
									['students', 'education', 'learning', 'language', 'schools'],
									['cells', 'cell', 'blood', 'disease', 'lab']]

	// group for parellel coordinates
	d3.select('svg').append('g')
		.attr('transform', 'translate('+left_pad+','+(100+lines_height+y_pad)+')')
		.attr('id', 'parallel')

	// append x-axis
	d3.select('#parallel').append('g').attr('id', 'xaxis')

	// plot title
	d3.select('#parallel').append('text').text('Topic Weights')
		.attr('transform', 'translate('+(parallel_width/2)+',-30)').attr('text-anchor', 'middle').attr('fill', '#000').attr('font-size', '20px')

	// array of topic names (length 10)
	dimensions = d3.keys(ted_talk_data[0]).filter(function(d) { return d.includes('_weight') })

	// scales
	var weight_scales = [];
  for (i in dimensions) {
    var name = dimensions[i];
    weight_scales.push(d3.scaleLinear()
			.range([parallel_height, 0])
			//.domain([0, 0.4])
			// optional: difference scale for each topic
			.domain( d3.extent(ted_talk_data, function(d) { return d[name]; }) ))
  }
	var topic_scale = d3.scalePoint().domain(d3.range(0, 10)).range([0, parallel_width]);

	// create line object
	var line = d3.line()
			.x(function(d, i) {return topic_scale(i)})
			.y(function(d, i) {return weight_scales[i](d)})

	// display text on mouseover
	function display_talk(d) {
		d3.select('#parallel').append('text')
			.attr('class', 'talk')
			.attr('text-anchor', 'middle')
			.attr('fill', brushed_line_color)
			.attr('x', parallel_width/2)
			.attr('y', -10)
			.text('Title: ' + d.title)
	}
	// remove text on mouseout
	function remove_talk_text(d) {
		d3.select('.talk').remove()
	}

	// data join for lines
	p_selection = d3.select('#parallel').selectAll('.p_line').data(ted_talk_data)
	p_selection.enter().append('path')
		.attr('class', 'p_line')
		.attr('d', d => line(d.weights))
		.attr('fill', 'none')
		.attr('stroke', normal_line_color)
		.attr('stroke-opacity', normal_line_opacity)
		.attr('stroke-width', '1')
		.on('mouseover', function(d) {
			// highlight line on mouseover
			display_talk(d);
			d3.select(this).raise()
				.style('stroke',brushed_line_color)
				.style('stroke-opacity', '1')
				.style('stroke-width', '2')
    })
		.on('mouseout', function(d) {
			// remove highlight on mouseout
			remove_talk_text(d);
			if (d3.select(this).attr('stroke') == brushed_line_color) {
				// line is brushed from year line-plot
				d3.select(this)
					.style('stroke', brushed_line_color)
					.style('stroke-opacity', brushed_line_opacity)
					.style('stroke-width', '1')
			}
			else {
				d3.select(this)
					.style('stroke', normal_line_color)
					.style('stroke-opacity', normal_line_opacity)
					.style('stroke-width', '1')
			}

	  });

	// x-axis
	d3.select('#parallel').selectAll('#xaxis')
			.attr('transform', 'translate(0,' + parallel_height + ')')
			.call(d3.axisBottom(topic_scale).tickFormat(d => ''))

	for (var i = 0; i < topic_groups.length; i++) {
		var height_delta = 20;
		for (var j = 0; j < topic_groups[i].length; j++) {
			d3.select('#parallel').append('text')
				.attr('class', ('x_text_' + i))
				.attr('text-anchor', 'middle')
				.attr('fill', '#000')
				.attr('font-size', '14px')
				.attr('x', topic_scale(i))
				.attr('y', parallel_height+height_delta)
				.text(topic_groups[i][j])
		height_delta += 15;
		}
	}

	// y-axes -- use dummy data (range of numbers 0-9) for join
	var y_axes = d3.select('#parallel').selectAll('.yaxis')
    .data(d3.range(0, 10)).enter().append('g')
    .attr("transform", function(d, i) { return 'translate(' + topic_scale(i) + ',0)'; })
		.attr('class', 'yaxis')
    .each(function(d, i) { d3.select(this).call(d3.axisLeft().scale(weight_scales[i])); })

		function reset_lines() {
			d3.select('#parallel').selectAll('.p_line')
					.attr('stroke', normal_line_color)
					.attr('stroke-opacity', normal_line_opacity)
					.attr('stroke-width', '1')
		}
	// function for brushing on each parallel axis
	function brush_axis() {
		reset_lines();
		t_id = d3.select(this).data()[0];
		w_scale = weight_scales[t_id];
		var line_select = d3.event.selection;
		var max_weight = w_scale.invert(line_select[0]), min_weight = w_scale.invert(line_select[1]);
		var brushed_lines = ted_talk_data.filter(d => (d.weights[t_id] >= min_weight) && (d.weights[t_id] <= max_weight))

		// FIXME: highlighting wrong lines
		d3.select('#parallel').selectAll('.p_line').data(brushed_lines, d => d.name)
			.attr('stroke', brushed_line_color)
			.attr('stroke-opacity', brushed_line_opacity)
			.attr('stroke-width', '1')
			.raise()
	}

	// place brush on each y-axis
	y_axes.append('g')
	.attr('class', 'brush')
	.each(function(d, i) {
		d3.select(this).call(weight_scales[i].brush = d3.brushY()
			.extent([[-8, 0], [8, parallel_height]])
			.on('brush', brush_axis))
	})

	/*
	*
	STACKED BAR PLOT
	*
	*/

	var bar_height = 800;
	var bar_width = 350;
	var bar_pad = 20;
	var row_height = 60;

	var ratings = Array.from(new Set(ted_talk_data.map(d => d.top_rating)))

	var topic_scale = d3.scaleBand()
		.domain(Array.from(new Set(ted_talk_data.map(d => d.topic_pred_id))))
		.range([bar_height, 0])
		.paddingInner(0.2);

	var popularity_scale = d3.scaleLinear()
		.domain([0, 1])
		.range([0, bar_width]);

	var topic_nest = d3.nest()
		.key(d => d.topic_pred_id)
		.rollup(d => {
			var dict = {};
			for(var i=0; i<ratings.length; ++i) {
				dict[ratings[i]] = (d.filter(video => ratings[i] == video.top_rating).length) / d.length;
			}
			return dict;
		})
		.entries(ted_talk_data);

	var topic_stack = d3.stack()
		.keys(ratings)
		.value((d, key) => {
			return d.value[key];
		});

	var stacked_data = topic_stack(topic_nest);

	d3.select('svg').append('g').attr('id', 'barplot')
		.attr('transform', 'translate('+(lines_width+200)+',0)');

	var topic_dict = {
		0: 'Society',
		1: 'Music',
		2: 'Conservation',
		3: 'Medicine',
		4: 'World development',
		5: 'Technology',
		6: 'Urban Development',
		7: 'Space',
		8: 'Education',
		9: 'Medicine #2'
	};

	var color_dict = {
		'Inspiring': 'red',
		'Funny': 'green',
		'Informative': 'yellow',
		'Ingenious': 'blue',
		'Persuasive': 'orange',
		'Jaw-dropping': 'purple',
		'Longwinded': 'brown',
		'Fascinating': 'lavender',
		'Courageous': 'lime',
		'Beautiful': 'navy',
		'Unconvincing': 'beige',
		'OK': 'teal',
		'Confusing': 'pink',
		'Obnoxious': 'magenta'
	};

	var color_palette = {
		'red':'#e6194b',
		'green': '#3cb44b',
		'yellow': '#ffe119',
		'blue': '#4363d8',
		'orange': '#f58231',
		'purple': '#911eb4',
		'teal': '#46f0f0',
		'magenta': '#f032e6',
		'lime': '#bcf60c',
		'pink': '#fabebe',
		'teal': '#008080',
		'lavender': '#e6beff',
		'brown': '#9a6324',
		'beige': '#fffac8',
		'maroon': '#800000',
		'mint': '#aaffc3',
		'olive': '#808000',
		'apricot': '#ffd8b1',
		'navy': '#000075',
		'grey':'#808080',
		'white': '#ffffff',
		'black': '#000000'
	};

	var topic_bar_groups = d3.select('#barplot').selectAll('empty')
		.data(stacked_data)
		.enter()
		.append('g')
		.attr('fill', d => color_palette[color_dict[d.key]])
		.attr('transform', 'translate('+bar_pad+',0)');

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	d3.select('#barplot').selectAll('empty')
		.data(topic_nest)
		.enter()
		.append('text')
		.text(d => topic_dict[d.key])
		.attr('x', bar_width+30)
		.attr('y', d => topic_scale(d.key)+35)
		.attr("font-size", "15px")
		.attr('fill', 'black');

	function getKeyByValue(d, value) {
		return Object.keys(d.data.value).find(key => d.data.value[key].toFixed(8) === value.toFixed(8));
	}

	function showInfoBubble(d) {
		var perc = d[1]-d[0]
		div.transition()
			.duration(200)
			.style('opacity', .9)
		div .html(getKeyByValue(d, perc) + "<br\>" + perc.toFixed(2))
			.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
	}

		function reset_bars() {
		
		}

		topic_bar_groups.selectAll('g')
			.data(d => d)
			.enter()
			.append('rect')
			.attr('y', d => topic_scale(d.data.key))
			.attr('height', row_height)
			.attr('x', d => popularity_scale(d[0]))
			.attr('width', d => popularity_scale(d[1])-popularity_scale(d[0]))
			.on('mouseover', (d) => {
					showInfoBubble(d)
			})
			.on('mouseout', () => {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			})
			.on('click', (d) => {
				reset_lines()
				//reset_bars()
				var perc = d[1]-d[0]
				var top_rating = getKeyByValue(d, perc)
				var brushed_data = ted_talk_data.filter(t => t.top_rating == top_rating && t.topic_pred_id == d.data.key)
				//d3.select(event.currentTarget).attr('fill', 'grey')
				d3.select('#parallel').selectAll('.p_line').data(brushed_data, d => d.name)
						.attr('stroke', brushed_line_color)
						.attr('stroke-opacity', brushed_line_opacity)
						.attr('stroke-width', '1')
						.raise()
			})
}
