import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const AreaChart = ({series, categories}) => {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories:categories,
    },
    yAxis: {
      title: {
        text: 'Values',
      },
    },
    plotOptions: {
        area: {
            pointStart: 1940,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: series,
    colors: ["#61c3fe", "#576cd3", "#f60","#9c27b0","#ccc"],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AreaChart;
