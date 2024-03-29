import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';
import { DashboardComponent } from '../user/dashboard/dashboard.component';
import { AddTemplatesComponent } from '../Admin/add-templates/AddTemplatesComponent';
import { AddtemplatemodelComponent } from '../model/addtemplatemodel/addtemplatemodel.component';
import { TemplateselectionComponent } from '../Admin/templateselection/templateselection.component';
import { AddmeteicsComponent } from '../Admin/addmeteics/addmeteics.component';

import { MetricsComponent } from '../Metrics/MetricsComponent';
import { SubmitMetricsComponent } from '../Metrics/submit-metrics/SubmitMetricsComponent';
import { MetricsTemplateComponent } from '../Templates/Metrics/MetricsTemplateComponent';
import { AssessmentTemplateComponent } from '../Templates/Assessment/AssessmentTemplateComponent';
import { SavedAssessmentsComponent } from '../common/table/saved-assessments/saved-assessments.component';
import { ReviewAssesmentsComponent } from '../common/table/review-assesments/review-assesments.component';
import { SubmittedAssessmentsComponent } from '../common/table/submitted-assessments/submitted-assessments.component';
import { ReviewedAssessmentComponent } from '../common/table/reviewed-assessment/reviewed-assessment.component';

import { TestComp } from '../mock/test/Test.component';
import { PendingAssessmentsReviewComponent } from '../Reviewer/pending-assessments-review/pending-assessments-review.component';
import { TakeAssessment } from '../user/takeAssessment/TakeAssessment.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { ReportsComponent } from '../reports/reports.component';
import { FaqComponent } from '../faq/faq.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    children: [
      { path: '', component: DashboardComponent, data: { breadcrumb: 'Home' } },
      {
        path: 'assessments',
        children: [
          {
            path: '',
            component: ReviewedAssessmentComponent,
            data: { breadcrumb: 'Assessments' },
          },
          {
            path: 'take-assessment',
            children: [
              {
                path: '',
                component: TakeAssessment,
                data: { breadcrumb: { alias: 'selectTemplate' } },
              },
              {
                path: 'assessment-template',
                component: AssessmentTemplateComponent,
                data: { breadcrumb: { alias: 'assessmentTemplate' } },
              },
            ],
          },
          {
            path: 'assessment-template',
            component: AssessmentTemplateComponent,
            data: { breadcrumb: { alias: 'assessmentTemplate' } },
          },
        ],
      },
      {
        path: 'review-assessments',
        children: [
          {
            path: '',
            component: PendingAssessmentsReviewComponent,
            data: { breadcrumb: 'Reviews' },
          },
          {
            path: 'assessment-template',
            component: AssessmentTemplateComponent,
            data: { breadcrumb: { alias: 'assessmentTemplate' } },
          },
          {
            path: 'metrics-template',
            component: MetricsTemplateComponent,
            data: { breadcrumb: { alias: 'metricsTemplate' } },
          },
        ],
      },
      {
        path: 'metrics',
        children: [
          {
            path: '',
            component: MetricsComponent,
            data: { breadcrumb: 'Metrics' },
          },
          {
            path: 'submit-metric',
            children: [
              {
                path: '',
                component: SubmitMetricsComponent,
                data: { breadcrumb: { alias: 'selectMetricTemplate' } },
              },
              {
                path: 'metrics-template',
                component: MetricsTemplateComponent,
                data: { breadcrumb: { alias: 'metricsTemplate' } },
              },
            ],
          },
          {
            path: 'metrics-template',
            component: MetricsTemplateComponent,
            data: { breadcrumb: { alias: 'metricsTemplate' } },
          },
        ],
      },
      {
        path: 'template-selection',
        children: [
          {
            path: '',
            component: TemplateselectionComponent,
            data: { breadcrumb: 'Templates' },
          },
          {
            path: 'add-templates',
            component: AddTemplatesComponent,
            data: { breadcrumb: { alias: 'addTemplate' } },
          },
          {
            path: 'add-metric',
            component: AddmeteicsComponent,
            data: { breadcrumb: { alias: 'addMetrics' } },
          },
          {
            path: 'assessment-template',
            component: AssessmentTemplateComponent,
            data: { breadcrumb: { alias: 'assessmentTemplate' } },
          },
          {
            path: 'metrics-template',
            component: MetricsTemplateComponent,
            data: { breadcrumb: { alias: 'metricsTemplate' } },
          },
        ],
      },
      {
        path: 'reports',
        children: [
          {
            path: '',
            component: ReportsComponent,
            data: { breadcrumb: 'Reports' },
          },
          {
            path: 'assessment-template',
            component: AssessmentTemplateComponent,
            data: { breadcrumb: { alias: 'assessmentTemplate' } },
          },
          {
            path: 'metrics-template',
            component: MetricsTemplateComponent,
            data: { breadcrumb: { alias: 'metricsTemplate' } },
          },
        ],
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: { breadcrumb: "FAQ's" },
      },
      {
        path: 'profile/:profile/:objectId',
        component: ProfileComponent,
        data: { breadcrumb: ' ' },
      },
    ],
  },

  { path: 'savedassessments', component: SavedAssessmentsComponent },
  { path: 'submittedassessments', component: SubmittedAssessmentsComponent },
  { path: 'addtemplatemodel', component: AddtemplatemodelComponent },
  // { path: 'login', component: LoginPageComponent},

  { path: 'test', component: TestComp },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? 'enabledNonBlocking'
          : 'disabled', // Set to enabledBlocking to use Angular Universal
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
