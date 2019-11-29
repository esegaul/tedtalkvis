function plot_it() {
	var left_pad = 100, bottom_pad = 80;
	var lines_width = 1000, lines_height = 400;
	var right_pad = 25, y_pad = 40
	var lines_width = lines_width-(left_pad+right_pad), lines_height = lines_height-2*y_pad;
	var parallel_width = lines_width;

	d3.select('svg').append('g')
		.attr('transform', 'translate('+left_pad+','+(40+parallel_width+y_pad)+')')
		.attr('id', 'parallel')

	// append axes
	d3.select('#parallel').append('g').attr('id', 'yaxis')
	d3.select('#parallel').append('g').attr('id', 'xaxis')

	// plot title
	d3.select('#parallel').append('text').text('Topic Weights')
		.attr('transform', 'translate('+(parallel_width/2)+',-15)').attr('text-anchor', 'middle').attr('fill', '#000').attr('font-size', '20px')

}
