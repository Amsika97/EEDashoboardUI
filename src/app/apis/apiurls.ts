export const Apiurls = {
  businessUnitApi: '/ee-dashboard/api/v1/businessUnits',
  projectsApi: '/ee-dashboard/api/v1/project/businessUnitId/',
  projectTypeApi: '/ee-dashboard/api/v1/projectTypes',
  templateTypeApi: '/ee-dashboard/api/v1/template/info/',
  savedAssessmentsApi: '/ee-dashboard/api/v1/assessment/all',
  submittedAssessmentsApi: '/ee-dashboard/api/v1/assessments/all',
};

export const AssessmentControllerURL = {
  getAssessmentByID: '/ee-dashboard/api/v1/assessment/1',
  reviewedAssessment: '/ee-dashboard/api/v1/assessment/assessmentStatusList?assessmentStatusList=APPROVED&assessmentStatusList=REJECTED&submittedBy=56',
  getAllAssessments: '/ee-dashboard/api/v1/assessment/details/submittedBy/',
  getAllMetrics : '/ee-dashboard/api/v1/metric/details/submittedBy/',
  saveOrSubmitAssessment: '/ee-dashboard/api/v1/assessment/saveOrSubmit',
  saveReviewerComment: '/ee-dashboard/api/v1/assessment/reviewerComment/save',
  uploadFile: '/ee-dashboard/api/v1/upload',
  deleteFile: '/ee-dashboard/api/v1/delete',
  assessmentsReport: '/ee-dashboard/api/v1/assessment/report/details',
  metricsReport: '/ee-dashboard/api/v1/metric/report/details',
};