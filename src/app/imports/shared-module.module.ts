import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { materialModules } from './matModuleConst';
import { CustomeComponents } from './componentConst';
import { matComponents } from './metricsConst';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AssessmentComponents } from './assessmentConst';
import { AdminComponents } from './adminConst';

import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbModule } from "xng-breadcrumb";
import { NgxUiLoaderModule } from 'ngx-ui-loader';

const commonModules = [
  AppRoutingModule,
  ReactiveFormsModule,
  FormsModule,
  HighchartsChartModule,
  NgMultiSelectDropDownModule.forRoot(),
  NgxPaginationModule,
  NgxUiLoaderModule,
  BreadcrumbModule
];

const AllComponents = [
  ...CustomeComponents,
  ...AssessmentComponents,
  ...AdminComponents,
  ...matComponents,
];

@NgModule({
  declarations: [...AllComponents],
  imports: [CommonModule, ...commonModules, ...materialModules],
  exports: [...AllComponents, ...materialModules],
})
export class SharedModule {}
