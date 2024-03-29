export interface IanswerData {
  lable: string;
  value: number;
}

export interface IanswerCheckData {
  lable: string;
  value: number;
  isChecked: boolean;
}

export interface IRadioQuestion {
  questionSubText:string;
  questionId: string;
  fieldType: string;
  question: string;
  valueType: string;
  answerValue: any[];
  answerData: IanswerData[];
  questionDescription: string;
}

export interface IRangeQuestion {
  questionSubText:string;
  questionId: string;
  fieldType: string;
  question: string;
  valueType: string;
  max: number;
  min: number;
  answerValue?: any[];
  questionDescription: string;
}
export interface ICheckboxQuestion {
  questionSubText:string;
  questionId: string;
  fieldType: string;
  question: string;
  valueType: string;
  answerValue: any[];
  answerData: IanswerCheckData[];
  questionDescription: string;
}

export interface SubmissionIModel {
  submissionId: number;
  submissionName: string;
}

export interface StatusIModel {
  statusId: string;
  statusName: string
}