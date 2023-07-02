import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


function SemiCirclePie() {
  const options = {
    chart: {
      type: "pie",
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
    },
    title: {
      text: "Product Sales",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "75%"],
        dataLabels: {
          enabled: false, // Disable data labels
        },
        size: "75%",
      },
    },
    series: [
      {
        name: "Sales",
        innerSize: "50%",
        data: [
          ["Product A", 50],
          ["Product B", 30],
          ["Product C", 20],
          ["Product D", 20],
          ["Product E", 20],
        ],
      },
    ],
  };
  return (
    <div>
      {" "}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default SemiCirclePie;
