import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';


HighchartsMore(Highcharts);

const BubbleChart = ({series}) => {
  // Define the chart options
  const options = {
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: '',
        align: 'left'
    },
    tooltip: {
        useHTML: true,
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                gravitationalConstant: 0.05,
                splitSeries: true,
                seriesInteraction: false,
                dragBetweenSeries: true,
                parentNodeLimit: true
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 0
                },
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series:series
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default BubbleChart;
