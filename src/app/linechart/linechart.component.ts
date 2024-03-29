import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HTTPService } from '../service/http.service';
import { Point } from 'highcharts/highcharts.src';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnChanges {
  accountFilterValue:any
  projectFilterValue:any
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['accountFilterValue'] || changes['projectFilterValue']) {
      this.service.filterAccount.pipe(debounceTime(1000)).subscribe((data)=>{this.accountFilterValue = data;
        this.reset()
        this.updateChart()
        }
        )
        this.service.filterProject.pipe(debounceTime(1000)).subscribe(data=>{this.projectFilterValue = data;
        this.reset()
        this.updateChart()
        }
        )
      this.updateChart()
    }
  }
  constructor(private service: HTTPService) { }
  selectedTimeRange: string = '15days'
  timeRange: string = '15days'
  barColor: string = ''
  apiUrl:any
  linechartData: any = {}
  assesmentsData: any[] = [];
  assessmentsDateRange: any[] = [];
  endDate: any
  @Input() value: boolean;


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  timeRangeChange() {
    this.timeRange = this.selectedTimeRange
    this.updateChart()
  }
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  getCategories(data: string): any[] {
    switch (data) {
      case 'week':
        return this.assessmentsDateRange.map(date => `${this.parseDate(date).getDate()}-${this.parseDate(date).toLocaleString('en-US', { month: 'short' })}`);
      case '15days':
        return this.assessmentsDateRange.map(date => `${this.parseDate(date).getDate()}-${this.parseDate(date).toLocaleString('en-US', { month: 'short' })}`);
      case 'month':
        return this.assessmentsDateRange.map(date => `${this.parseDate(date).getDate()}-${this.parseDate(date).toLocaleString('en-US', { month: 'short' })}`);
      case 'yearly':
        return this.assessmentsDateRange
      default:
        return []
    }
  }
  reset(){
    this.assesmentsData=[]
    this.assessmentsDateRange=[]
  }



  private updateChart() {
    const currentDate = new Date();
    const startDateLast30Days = new Date(currentDate);
    startDateLast30Days.setDate(currentDate.getDate() - 30);

    const startDateLast15Days = new Date(currentDate);
    startDateLast15Days.setDate(currentDate.getDate() - 15);

    const startDateLast1Year = new Date(currentDate);
    startDateLast1Year.setFullYear(currentDate.getFullYear() - 1);

    const startDateLast7Days = new Date(currentDate);
    startDateLast7Days.setDate(currentDate.getDate() - 7);

    switch (this.timeRange) {
      case 'week':
        this.endDate = startDateLast7Days.getTime();
        break;
      case 'month':
        this.endDate = startDateLast30Days.getTime();
        break;
      case '15days':
        this.endDate = startDateLast15Days.getTime();
        break;
      case 'yearly':
        this.endDate = startDateLast1Year.getTime();
        break;
    }
    if(this.accountFilterValue && this.projectFilterValue?.length>0){
      this.apiUrl =  this.value ? `/ee-dashboard/api/v1/metric/lineChart/startDate/${this.endDate}/endDate/${currentDate.getTime()}?filterName=PROJECT&filterValue=${this.projectFilterValue}`
      : `/ee-dashboard/api/v1/assessment/lineChart/startDate/${this.endDate}/endDate/${currentDate.getTime()}?filterName=PROJECT&filterValue=${this.projectFilterValue}`
    }
    else if(this.accountFilterValue && (this.projectFilterValue === null || this.projectFilterValue.length === 0)){
      this.apiUrl =  this.value ? `/ee-dashboard/api/v1/metric/lineChart/startDate/${this.endDate}/endDate/${currentDate.getTime()}?filterName=ACCOUNT&filterValue=${this.accountFilterValue}`
      : `/ee-dashboard/api/v1/assessment/lineChart/startDate/${this.endDate}/endDate/${currentDate.getTime()}?filterName=ACCOUNT&filterValue=${this.accountFilterValue}`
    }
    else{
    this.apiUrl = this.value ? `/ee-dashboard/api/v1/metric/lineChart/startDate/${this.endDate}/endDate/${currentDate.getTime()}`
      : `/ee-dashboard/api/v1/assessment/lineChart/startDate/${this.endDate}/endDate/${currentDate.getTime()}`
    }
    this.service.httpRequest(this.apiUrl, 'GET')
      .subscribe((data: any) => {
        this.linechartData = data
        if (Array.isArray(data)) {
          const SortedLineChartData = data.sort((a: any, b: any) => {
            const dateA = this.parseDate(a.date).getTime();
            const dateB = this.parseDate(b.date).getTime();
            return dateA - dateB;
          })
          if (this.timeRange === 'yearly') {
            const monthlyCounts: { [month: string]: number } = {};
            SortedLineChartData.forEach((item: any) => {
              const month = this.parseDate(item.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
              monthlyCounts[month] = (monthlyCounts[month] || 0) + +item.count;
            });
            this.assessmentsDateRange = Object.keys(monthlyCounts)
            this.assesmentsData = Object.values(monthlyCounts);
          }
          else {
            this.assesmentsData = SortedLineChartData.map((item: any) => +item.count);
            this.assessmentsDateRange = SortedLineChartData.map((item: any) => item.date);
          }
        }

        this.chartOptions = {
          credits: {
            enabled: false,
          },
          xAxis: {
            categories: this.getCategories(this.timeRange),
            title: { text: '' },
            crosshair: false,
            tickInterval: Math.ceil(this.getCategories(this.timeRange).length / 14),
          },

          yAxis: {
            title: {
              text: '',
              align:'low'
            },

          },

          title: { text: ''
                    
                  },
          series: [
            {
              showInLegend: false,
              type: 'column',
              data: this.assesmentsData,

            },
          ],

          plotOptions: {
            column: {
              color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 0 },
                stops: [
                  [0, this.value ? '#BD267D' : '#234F80'],
                ],
              },
            },

          },
          tooltip: {

            formatter: function () {
              const count = this.y;
              const date = this.x
              return `${date}<br/>Count: <b>${count}</b>`;
            },

          },
          chart: {
            type: 'column',
            height: 220
          }
        };
      }, (error: any) => {
        if (error.status === 0) {
          console.error("Network error");
        }
      }
      )

  }

}
