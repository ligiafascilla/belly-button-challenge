// Define URL for JSON data
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to update all plots and metadata
function updatePlots(sample) {
  // Use D3 to read in the JSON data
  d3.json(url).then(function(data) {
    // Get the necessary arrays from the data
    var sampleData = data.samples.find(obj => obj.id === sample);
    var sampleValues = sampleData.sample_values;
    var otuIDs = sampleData.otu_ids;
    var otuLabels = sampleData.otu_labels;
    
    // Update bar chart
    var barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var barData = [barTrace];

    Plotly.newPlot("bar", barData);

    // Update the bubble chart
    var bubbleTrace = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Earth"
      }
    };

    var bubbleData = [bubbleTrace];

    Plotly.newPlot("bubble", bubbleData);

    // Update the metadata
    var metadata = data.metadata.find(obj => obj.id === parseInt(sample));

    var metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html("");

    Object.entries(metadata).forEach(function([key, value]) {
      metadataDiv.append("p").text(`${key}: ${value}`);
    });
  });
}

// Create dropdown menu
var dropdown = d3.select("#selDataset");

// Use D3 to read in the JSON data
d3.json(url).then(function(data) {
  // Populate the dropdown menu with sample names
  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
  });

  // Update plots and metadata for the initial sample
  var initialSample = data.names[0];
  updatePlots(initialSample);
});

// Event handler for the dropdown menu
function optionChanged(selectedSample) {
  updatePlots(selectedSample);
}

