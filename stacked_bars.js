function plot_it()  {
	var bar_height = 1000;
	var bar_width = 600;
	var bar_pad = 50;
	var row_height = 20;

	d3.select('body').append('svg').attr('width', bar_width+bar_pad).attr('height', bar_height);

	var ratings = Array.from(new Set(ted_talk_data.map(d => d.top_rating)))

	var topic_scale = d3.scaleBand()
		.domain(Array.from(new Set(ted_talk_data.map(d => d.topic_pred_id))))
		.range([bar_width, 0])
		.paddingInner(0.2);
	
	var popularity_scale = d3.scaleLinear()
		.domain([0, 1])
		.range(0, bar_width);
	
	//nest by topic
	//rollup: for each video in topic, iterate over all tags, filter array to only have those rating
			//return an object that has ratings and values

	var topic_nest = d3.nest()
		.key(d => d.topic_pred_id)
		.rollup(d => { //d represents the array of videos in this topic
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
	console.log(topic_stack(topic_nest));

	
	d3.select('svg').append('g').attr('id', 'barplot');

	var topic_bar_groups = d3.select('#barplot').selectAll('empty')
		.data(stacked_data)
		.enter()
		.append('g')
	
	topic_bar_groups.selectAll('g')
		.data(d => d)
		.enter()
		.append('rect')
		.attr('y', d => topic_scale(d.data.key))
		.attr('height', row_height)
		.attr('x', d => popularity_scale(d[0]))
		.attr('width', d => popularity_scale(d[1])-popularity_scale(d[0]) )
		//.attr('length')



}
