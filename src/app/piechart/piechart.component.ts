import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { HTTPService } from '../service/http.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css'],
})
export class PiechartComponent implements OnChanges {
  accountFilterValue: any;
  projectFilterValue: any[];
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['value'] ||
      changes['accountFilterValue'] ||
      changes['projectFilterValue']
    ) {
      this.service.filterAccount
        .pipe(debounceTime(1000))
        .subscribe((data: any) => {
          this.accountFilterValue = data;
          this.reset();
          this.updateChart();
        });
      this.service.filterProject.pipe(debounceTime(1000)).subscribe((data) => {
        this.projectFilterValue = data;

        this.reset();
        this.updateChart();
      });

      this.reset();
      this.updateChart();
    }
  }
  reset() {
    this.assessmentCount = [];
    this.assessmentKeys = [];
    this.assessmentValues = [];
  }
  ngOnDestroy() {
    this.service.filterAccount.complete();
    this.service.filterProject.complete();
  }
  constructor(private service: HTTPService) {}

  @Input() value: boolean;
  @Input() filterObject: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  pieChartData: any = {};
  assessmentKeys: any[] = [];
  assessmentValues: any[] = [];
  assessmentCount: any[] = [];
  apiUrl: any;
  noData: boolean = false;
  private updateChart() {
    if (this.accountFilterValue && this.projectFilterValue?.length > 0) {
      this.apiUrl = this.value
        ? `/ee-dashboard/api/v1/metric/piechartData/filters?filterName=PR&filterValue=${this.projectFilterValue}`
        : `/ee-dashboard/api/v1/dashboard/piechartData/filters?filterName=PR&filterValue=${this.projectFilterValue}`;
    } else if (
      this.accountFilterValue &&
      (this.projectFilterValue === null || this.projectFilterValue.length === 0)
    ) {
      this.apiUrl = this.value
        ? `/ee-dashboard/api/v1/metric/piechartData/filters?filterName=AC&filterValue=${this.accountFilterValue}`
        : `/ee-dashboard/api/v1/dashboard/piechartData/filters?filterName=AC&filterValue=${this.accountFilterValue}`;
    } else {
      this.apiUrl = this.value
        ? '/ee-dashboard/api/v1/metricDashboard/piechartData'
        : '/ee-dashboard/api/v1/dashboard/piechartData';
    }
    this.service.httpRequest(this.apiUrl, 'GET').subscribe(
      (data: any) => {
        this.assessmentCount = [];
        this.assessmentKeys = [];
        this.assessmentValues = [];
        if (!data.message) {
          this.pieChartData = data;
          for (const key in data) {
            if (key !== 'unit') {
              const value: string = data[key];
              if (typeof value === 'string') {
                const numericValue = parseFloat(value.replace('%', ''));
                this.assessmentKeys.push(
                  key.charAt(0).toUpperCase() + key.slice(1)
                );
                this.assessmentValues.push(numericValue);
              } else if (typeof value === 'number') {
                this.assessmentCount.push(value);
              }
            }
          }
        }

        this.chartOptions = {
          credits: {
            enabled: false,
          },
          xAxis: {
            title: { text: 'Assessment Date' },

            crosshair: false,
          },

          yAxis: {
            title: { text: 'Assessment Count' },
          },

          title: { text: '' },
          series: [
            {
              type: 'pie',
              data: this.assessmentValues.map((value, index) => ({
                y: value,
                name: this.assessmentKeys[index],
                className: this.assessmentCount[index],
                dataLabels: {
                  enabled: true,
                  format:
                    // '<b style="color:#31374A">{point.name}</b><br> <span style="color:#B5BAD0;font-weight:normal">Count:</span>  <span style="color:#234f80">{point.className}</span> <br> <span style="color:#B5BAD0;font-weight:normal">%:</span> <span style="color:#234f80">{point.percentage:.1f}%</span> ',
                    '<b style="color:#91979D">{point.name}</b><br> <span>{point.percentage:.1f}%</span> <span>({point.className})</span>',
                },
              })),
              tooltip: {
                pointFormat: 'Count : {point.className}',
              },
            },
          ],
          chart: {
            type: 'pie',
            height: 230,
          },
          plotOptions: {
            pie: {
              colors: ['#00E38B', '#234F80', '#EE0200', '#FFAA33'],
            },
          },
        };
      },
      (error: any) => {
        if (error.status === 0) {
          this.noData = true;
          console.error('Network error');
        }
      }
    );
  }
}
