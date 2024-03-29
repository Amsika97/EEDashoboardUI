import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HTTPService } from 'src/app/service/http.service';

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  data = new Date();
  graphCount: any[] = [];
  graphDate: any[] = [];

  constructor(private service: HTTPService) {}

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chartOptionsPie: Highcharts.Options;

  ngOnInit() {
    this.service
      .httpRequest(
        '/ee-dashboard/api/v1/assessment/lineChart/startDate/1698796800000/endDate/1701302400000',
        'get'
      )
      .subscribe({
        next: (resp: any) => {
          !!resp &&
            resp.forEach((obj: any) => {
              this.graphCount.push(obj.count);
              this.graphDate.push(obj.date);
            });

          this.chartOptions = {
            credits: {
              enabled: false,
            },
            xAxis: {
              categories: this.graphDate,
              title: { text: 'Assessment Date' },
              crosshair: false,
            },

            yAxis: {
              title: { text: 'Assessment Count' },
            },

            title: { text: 'Assessment Chart' },
            series: [
              {
                showInLegend: false,
                type: 'line',
                data: this.graphCount,
              },
            ],
          };
        },
        error: (err) => {
          console.log('error', err);
        },
        complete: () => {},
      });

    //pie chart
    this.chartOptionsPie = {
      credits: {
        enabled: false,
      },
      chart: {
        plotShadow: false,
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            style: {
              color: 'black',
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Assessment Share',
          data: [
            {
              name: 'Accept',
              color: '#00FF00',
              y: 50,
            },
            {
              name: 'Reject',
              color: '#FF00FF',
              y: 25,
            },
            {
              name: 'Pening',
              color: 'red',
              y: 25,
            },
          ],
          showInLegend: true,
        },
      ],
    };
  }
}
