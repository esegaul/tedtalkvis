# Ted Talk Visualization

## To run the visualization:
Clone the repository and run `python -m http.server` from the command line. Then, open a browser and navigate to the local host on which the visualization is being served.

## Supported Interactions:
- __Stacked Area Plot__:
	-  Hovering over one of the topic area marks with your mouse will toggle the highlighting on the parallel coordinates plot of all of the talks for which the hovered topic is the topic with the highest prediction weight.
- __Parallel Coordinates Plot__:
	- Hovering over any talk will toggle a text display of the title of the talk, as well as the entire talk weight-line being highlighted in red.
	- Brushing is supported on all topic-weight axes (y-axes), allowing the user to brush over topic axes to highlight only lines who pass through all toggled brushes.
- __Stacked Bar Plot__:
	- Clicking any sub-bar toggles the highlighting on the parallel coordinates of all talks whose top topic corresponds to the parent bar and whose top user reaction corresponds to the sub-bar selected. Multiple sub-bars may be selected within the same parent bar to show talks with multiple top reactions.

## Methodology:
See `Process Journal.pdf` for a detailed summary of the methodologies used to build this visualization. The data is from Kaggle.com, the topic weighting is done with Non-Negative Matrix Factorization on talk transcripts, and D3.js is used for visualization.

## Authors:
This project was built by Jarrett Perkins, Evan Segaul, and David Taylor for "CS 3891: Data Visualization" at Vanderbilt Univeristy.