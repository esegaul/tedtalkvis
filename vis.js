function plot_it()  {

	var left_pad = 100, bottom_pad = 80;
	var lines_width = 1000, lines_height = 400;
	var right_pad = 25, y_pad = 40
	var lines_width = lines_width-(left_pad+right_pad), lines_height = lines_height-2*y_pad;

	var year_keys = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"]

	var svg = d3.select('body').append('svg').attr('width', 1000).attr('height', 1000).attr('transform', 'translate(5,5)')
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
		"#6a3d9a]"]

	var count_max = 0;

	var nested_data = d3.nest()
	.key(d => d.topic_pred_id)
	.key(d => d.film_year)
	.rollup(d => {
		count_max = Math.max(d.length, count_max)
		return d.length
	})
	.entries(ted_talk_data)

	// scales
	var x_scale = d3.scalePoint().domain(year_keys).range([0,lines_width]);
	var y_scale = d3.scaleLinear().domain([0, count_max]).range([lines_height,0]);
	var line = d3.line().x(d => x_scale(d.key)).y(d => y_scale(d.value))

	// data join
	var update_selection = d3.select('#lines').selectAll('.line_mark').data(nested_data)
	update_selection.enter().append('path')
		.attr('class', 'line_mark')
		.attr('d', d => {
			return line(d.values)
		})
		.attr('fill', 'none')
		.attr('stroke', d => colors[d.key])
		.attr('stroke-width', '2.5')
		.attr('opacity', '1')

	update_selection.transition().duration(1200).attr('d', d => line(d))

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

	// addd legend
	d3.select('#lines').selectAll("circs")
	.data(nested_data)
	.enter()
	.append("circle")
	.attr('transform', 'translate('+(lines_width)+',-15)')
	.attr("cx", 50)
	.attr("cy", (d, i) => i*30)
	.attr("r", 7)
	.style("fill", d => colors[d.key])

	d3.select('#lines').selectAll("labels")
	.data(nested_data)
	.enter()
	.append("text")
	.attr('transform', 'translate('+(lines_width)+',-15)')
	.attr("x", 70)
	.attr("y", (d, i) => i*30)
	.style("fill", d => colors[d.key])
	.text(d => d.key)
	.attr("text-anchor", "left")
	.style("alignment-baseline", "middle")

	// PARALLEL COORDINATES

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
	var weight_scales = []
  for (i in dimensions) {
    name = dimensions[i]
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

	function display_talk(d) {
		d3.select('#parallel').append('text')
			.attr('class', 'talk')
			.attr('text-anchor', 'middle')
			.attr('fill', '#d73027')
			.attr('x', parallel_width/2)
			.attr('y', -10)
			.text('Talk Title: ' + d.name)
	}

	function remove_talk(d) {
		d3.select('.talk').remove()
	}

	// data join for lines
	d3.select('#parallel').selectAll('.p_line').data(ted_talk_data).enter().append('path')
		.attr('class', 'p_line')
		.attr('d', d => line(d.weights))
		.attr('fill', 'none')
		.attr('stroke', '#4575b4')
		.attr('stroke-opacity', '0.1')
		.attr('stroke-width', '1')
		.on('mouseover', function(d) {
			display_talk(d);
			d3.select(this).raise()
				.style('stroke','#d73027')
				.style('stroke-opacity', '1')
				.style('stroke-width', '2')
    })
		.on('mouseout', function(d) {
			remove_talk(d);
			d3.select(this)
				.style('stroke','#4575b4')
				.style('stroke-opacity', '0.1')
				.style('stroke-width', '0.5')
	  });

	// x-axis
	d3.select('#parallel').selectAll('#xaxis')
			.attr('transform', 'translate(0,' + parallel_height + ')')
			.call(d3.axisBottom(topic_scale).tickFormat(d => ''))

	for (var i = 0; i < topic_groups.length; i++) {
		var height_delta = 20;
		for (var j = 0; j < topic_groups[i].length; j++) {
			d3.select('#parallel').append('text')
				.attr('text-anchor', 'middle')
				.attr('fill', '#000')
				.attr('font-size', '14px')
				.attr('x', topic_scale(i))
				.attr('y', parallel_height+height_delta)
				.text(topic_groups[i][j])
		height_delta += 15;
		}
	}

	// y-axes
	var y_axes = d3.select('#parallel').selectAll('#yaxis')
    .data(dimensions).enter().append('g')
    .attr("transform", function(d, i) { return 'translate(' + topic_scale(i) + ',0)'; })
		.attr('class', 'yaxis')
    .each(function(d, i) { d3.select(this).call(d3.axisLeft().scale(weight_scales[i])); })

	// FIXME: BRUSH ON EACH Y-AXIS
	/*
	// brush on each y-axis
	y_axes.append('g')
	.attr('class', 'brush')
	.each(function(d, i) {
		d3.select(this).call(weight_scales[i].brush = d3.brushY()
			.extent([[-8, 0], [8, parallel_height]])
			.on('brush', brush));
	})

	function brush() {
		var line_select = d3.event.selection;
		console.log(line_select);
	}
	*/
}
