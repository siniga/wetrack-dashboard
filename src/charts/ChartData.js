export const getChart = (chartType, categories, series)=>{
    const options = {
        chart: {
          type: chartType
        },
        title: {
          text: '',
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        },
        yAxis: {
          title: {
            text: 'Values',
          },
        },
        series: series,
        colors: ['#61c3fe', '#576cd3', '#f60'],
      };

      return options;
}