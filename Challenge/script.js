function init() {
    var selector = d3.select('#selDataset');

    d3.json('samples.json').then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((name) => {
            selector.append('option')
            .text(name)
            .property('value', name)
        });
        var firstid = sampleNames[0];
        buildCharts(firstid);
    });
}

init();

d3.selectAll('#selDataset').on('change', optionChanged);
function optionChanged(new_id) {
    buildMetadata(new_id);
    buildCharts(new_id);
};
function buildMetadata(id) {
    var menu = d3.select('#selDataset');
    id = menu.property('value');
    d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        console.log(metadata);
        var resultArray = metadata.filter(sample => sample.id == id);
        console.log(resultArray);
        let resultObject = resultArray[0];
        console.log(resultObject);
        var panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(resultObject).forEach(([key,value]) => panel.append('h6').text(key.toUpperCase() + ': ' + value));
    });
};

function buildCharts(id) {
    var menu = d3.select('#selDataset');
    id = menu.property('value');
    d3.json('samples.json').then((data) => {
        let resultArray = data.samples.filter(sample => sample.id == id);
        let wfreqArray = data.metadata.filter(sample => sample.id == id);
        console.log(resultArray);
        let otu_id = resultArray[0].otu_ids;
        let otu_values = resultArray[0].sample_values;
        let otu_labels = resultArray[0].otu_labels;
        let wfreq = parseFloat(wfreqArray[0].wfreq);
        console.log(otu_id);
        console.log(otu_values);
        let top_ten = otu_values.sort((a,b) => b - a).slice(0,10);
        let xvalue = top_ten.reverse();
        let yvalue = otu_id.slice(0,10).map(otu => `OTU ${otu}`).reverse();
        var trace = {
            x: xvalue,
            y: yvalue,
            orientation: 'h',
            type: 'bar',
            text: otu_labels
        };
        var layout = {
            title: {text: 'OTU Values', font:{size: 30, family: 'Gills Sans MT', color: '#001432'}},
            ticks: {yvalue},
            xaxis: {title: "Bacteria Count"},
            yaxis: {title: "OTU ID's"},
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };
        var trace1 = {
            x: otu_id,
            y: otu_values,
            mode: 'markers',
            marker: {
                size: otu_values,
                color: otu_id
            },
            text: otu_labels
        };
        var layout1 = {
            title: {text: 'Bacteria Cultures per Sample', font:{size: 30, family: 'Gills Sans MT', color: '#001432'}},
            showlegend: false,
            height: 600,
            width: 1200,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };
        var trace2 = {
            domain: {x: [0, 1], y: [0, 1]},
            value: wfreq,
            title: {text: '<b> Belly Button Washing Frequency </b><br /> Scrubs per Week', font:{size: 30, family: 'Gills Sans MT', color: '#001432'}},
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
                bar: {color: 'black'},
                steps: [
                    {range: [0,2], color: 'red'},
                    {range: [2,4], color: 'orange'},
                    {range: [4,6], color: 'yellow'},
                    {range: [6,8], color: 'limegreen'},
                    {range: [8,10], color: 'green'}
                ]
            },

        };
        var layout2 = {
            width: 600,
            height: 450,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };
        Plotly.newPlot('bar', [trace], layout);
        Plotly.newPlot('bubble', [trace1], layout1);
        Plotly.newPlot('gauge', [trace2], layout2);
    });
}