export const newMetricTemplateData = {
  metricSubmitId: 1,
  templateId: 1,
  templateName: 'T1',
  submitedAt: 1692618576,
  projectType: 2,
  templateUploadedUserId: 1,
  submitedBy: 56,
  projectId: 1,
  businessUnit: 2,
  templateUploadedUserName: 'Ravi',
  reviewers: [
    {
      reviewerId: 1,
      reviewerAt: 1692618576,
      comment: '',
    },
  ],
  projectCategory: [
    {
      categoryName: 'Requirement Phase',
      templateQuestionnaire: [
        {
          questionId: 1,
          fieldType: 'radio',
          question: '1. How well-defined are the project objectives? ',
          valueType: 'number',
          answerData: [
            {
              lable: 'yes',
              value: 1,
            },
            {
              lable: 'No',
              value: 0,
            },
          ],
        },
        {
          questionId: 2,
          question: '1. How well-defined are the project objectives? ',
          fieldType: 'checkbox',
          valueType: 'number',
          answerData: [
            {
              lable: 'importan',
              value: 1,
            },
            {
              lable: 'very important',
              value: 2,
            },
            {
              lable: 'Not importan',
              value: 3,
            },
            {
              lable: 'important',
              value: 5,
            },
          ],
        },
        {
          questionId: 10,
          question: '1. How well-defined are the project objectives? ',
          fieldType: 'dropdown',
          valueType: 'number',
          answerData: [
            {
              lable: 'importan',
              value: 1,
            },
            {
              lable: 'very important',
              value: 2,
            },
            {
              lable: 'Not importan',
              value: 3,
            },
            {
              lable: 'important',
              value: 5,
            },
          ],
        },
      ],
    },
    {
      categoryName: 'Intial category',
      templateQuestionnaire: [
        {
          questionId: 3,
          question: '1. How well-defined are the project objectives? ',
          fieldType: 'range',
          valueType: 'number',
          max: 10,
          min: 5,
        },
        {
          questionId: 4,
          question: '1. How well-defined are the project objectives? ',
          fieldType: 'range',
          valueType: 'decimal',
          max: 9.5,
          min: 4.5,
        },

        {
          questionId: 5,
          question: '1. How well-defined are the project objectives? ',
          fieldType: 'text',
          valueType: 'String',
        },
      ],
    },
  ],
  submitStatus: 'SAVE',
};
