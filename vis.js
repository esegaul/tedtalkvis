function plot_it()  {

	var left_pad = 100, bottom_pad = 80;
	var lines_width = 1000, lines_height = 400;
	var right_pad = 25, y_pad = 40
	var lines_width = lines_width-(left_pad+right_pad), lines_height = lines_height-2*y_pad;

	var year_keys = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"]

	d3.select('body').append('svg').attr('width', 1000).attr('height', 1000).attr('transform', 'translate(5,5)')
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
			console.log(d.values)
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

}
