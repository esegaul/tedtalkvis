function plot_it() {
	// set lollipop parameters
	var left_pad = 100, bottom_pad = 80;
	lollipop_height = 400
	lollipop_width = 300

	// append svg element
	var svg = d3.select('body').append('svg')
			.attr('width', 1500)
			.attr('height', 1000)
			.attr('transform', 'translate(5,5)')
			.append('g')
				.attr('transform', 'translate('+left_pad+','+(lollipop_height+bottom_pad)+')')
				.attr('id', 'lollipop')

	// append axes
	svg.append('g').attr('id', 'yaxis')
	svg.append('g').attr('id', 'xaxis')

	// sort data
	topic_tag_data.sort((a,b) => {
		if(a.count > b.count)
			return -1;
		return 1;
	});

	var min_count = d3.min(topic_tag_data, d => d.count), max_count = d3.max(topic_tag_data, d => d.count)
	var tag_names = d3.set(topic_tag_data, d => d.tag).values();

	var count_scale = d3.scaleLinear().domain([0, max_count]).range([0, lollipop_width]);

	svg.append("g")
	  .attr("transform", "translate(0," + lollipop_height + ")")
	  .call(d3.axisBottom(count_scale))
	  .selectAll("text")
	    .attr("transform", "translate(5,0)")
	    .style("text-anchor", "end");

	var tag_scale = d3.scaleBand().domain(tag_names).range([0, lollipop_height]).padding(1);
	svg.append("g").call(d3.axisLeft(tag_scale))

	// label axes and title
	svg.append('text').text('Top 10 Tags for Selected Topic')
		.attr('transform', 'translate(' + (lollipop_width / 2) +',0)')
		.attr('text-anchor', 'middle')
	svg.append('text').text('Number of Talks with Tag')
		.attr('transform', 'translate(' + (lollipop_width / 2) +',' + (lollipop_height + 35) + ')')
		.attr('text-anchor', 'middle')
	svg.append('text').text('Tag')
		.attr('transform', 'translate(-85,' + (lollipop_height / 2) + ') rotate(270)')
		.attr('text-anchor', 'middle')

	// append lines
	svg.selectAll("myline")
  .data(topic_tag_data)
  .enter()
  .append("line")
    .attr("x1", function(d) { return count_scale(d.count); })
    .attr("x2", count_scale(0))
    .attr("y1", function(d) { return tag_scale(d.tag); })
    .attr("y2", function(d) { return tag_scale(d.tag); })
    .attr("stroke", "#999999")

	// append circles
	svg.selectAll('.circles').data(topic_tag_data)
		.enter().append('circle')
			.attr("cx", function(d) { return count_scale(d.count); })
			.attr("cy", function(d) { return tag_scale(d.tag); })
			.attr("r", 4)
			.style("fill", '#3288bd')
			.attr("stroke", 'black')
}
