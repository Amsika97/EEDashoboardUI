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
  saveOrSubmitAssessment: '/ee-dashboard/api/v1/assessment/saveOrSubmit',
  saveOrMetrics: '/ee-dashboard/api/v1/metric/saveOrSubmit',
  saveReviewerComment: '/ee-dashboard/api/v1/assessment/reviewerComment/save',
  saveReviewerMetricComment:
    '/ee-dashboard/api/v1/metric/metricreviewercomment/save',
  assessmentReviewerComment:
    '/ee-dashboard/api/v1/assessment/reviewerComment/save',
  metricReviewerComment:
    '/ee-dashboard/api/v1/metric/metricreviewercomment/save',
  uploadFile: '/ee-dashboard/api/v1/upload',
  deleteFile: '/ee-dashboard/api/v1/delete',
  reviewdAssessment:
    '/ee-dashboard/api/v1/assessment/assessmentStatusList?assessmentStatusList=APPROVED&assessmentStatusList=REJECTED&submittedBy=56',
  downloadFile: '/ee-dashboard/api/v1/download',
};
