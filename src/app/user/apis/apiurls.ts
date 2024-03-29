export const Apiurls = {
  businessUnitApi: '/ee-dashboard/api/v1/businessUnits',
  projectsApi: '/ee-dashboard/api/v1/project/businessUnitId/',
  projectByAccountId: '/ee-dashboard/api/v1/project/info/accountId/',
  newAccountAPI: '/ee-dashboard/api/v1/account/all',
  accountAPI: '/ee-dashboard/api/v1/byBusinessUnit/',
  templateAPI: '/ee-dashboard/api/v1/template/distinct/template-display-names',
  projectTypeApi: '/ee-dashboard/api/v1/filtered/projectTypes',
  statusTypeApi: '/ee-dashboard/api/v1/users/all/dropdown-options',
  reportFiltersApi: '/ee-dashboard/api/v1/report/filters',
  templateTypeApi: '/ee-dashboard/api/v1/template/info/',
  metricTemplate: '/ee-dashboard/api/v1/metricTemplate/info/projectTypeId/',
  savedAssessmentsApi: '/ee-dashboard/api/v1/assessment/all',
  submittedAssessmentsApi: '/ee-dashboard/api/v1/assessments/all',
};

export const AssessmentControllerURL = {
  getAssessmentByID: '/ee-dashboard/api/v1/assessment/1',
  saveOrSubmitAssessment: '/ee-dashboard/api/v1/assessment/saveOrSubmit',
  saveReviewerComment: '/ee-dashboard/api/v1/assessment/reviewerComment/save',
  uploadFile: '/ee-dashboard/api/v1/upload',
  deleteFile: '/ee-dashboard/api/v1/delete',
  reviewdAssessment:
    '/ee-dashboard/api/v1/assessment/assessmentStatusList?assessmentStatusList=APPROVED&assessmentStatusList=REJECTED&submittedBy=56',
  pendingAssessmentsReview: '/ee-dashboard/api/v1/assessment/pendingReview/all',
};
