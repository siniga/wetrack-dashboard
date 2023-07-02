import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function ColumnChart({series, categories}) {
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: categories
    },
    yAxis: {
      title: {
        text: "Values",
      },
    },
    series: series,
    colors: ["#61c3fe", "#f60"],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );

  return <div>ColumnChart</div>;
}

export default ColumnChart;
