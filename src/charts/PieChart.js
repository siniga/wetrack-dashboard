import React from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function PieChart({series}) {
    const options = {
        chart: {
          type: 'pie',
        },
        title: {
          text: '',
          align: 'left'
        },
        plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false
              },
              showInLegend: true
          }
      },
        series: series,
        dataLabels: {
          enabled: false, // Disable data labels
        },
        colors: ["#61c3fe", "#f60","#576cd3","#9c27b0","#ccc"],
      };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  )
}

export default PieChart