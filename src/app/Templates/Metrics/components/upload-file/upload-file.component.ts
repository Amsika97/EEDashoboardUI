import { Component, Input } from '@angular/core';
import { IRadioQuestion } from '../QuestionInterface';
import { HTTPService } from 'src/app/service/http.service';
import { AssessmentControllerURL } from 'src/app/apis/apiurls';
import { environment } from 'src/environments/environment';
import { ConsentPopupComponent } from 'src/app/common/consentPopup/consentPopup.component';
import { ConfirmationPopupComponent } from 'src/app/common/ConfirmationPopup/ConfirmationPopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css', '../style.css'],
})
export class UploadFileComponent {
  @Input() questionDetails: any;
  @Input() disableQuestion: string | boolean;
  @Input() questionIndex: any;
  @Input() valueType: string;
  @Input() categoryList: any;
  @Input() isSubmitted: any;

  ngOnInit() {
    this.questionDetails.isValid = true;
  }

  textChange(event: any, question: any) {
    question.fileWithComment = event.target.value;
  }

  respMsg = { type: '', message: '' };
  is_Submitted: any;

  constructor(private service: HTTPService, public dialog: MatDialog) {}

  onFileSelected(event: any, obj: any) {
    obj.selectedFile = event;
    obj.tempfileUri = event.target.files[0].name;
  }

  uploadFile(obj: any): void {
    const file: File = obj.selectedFile.target.files[0];

    if (file) {
      //this.isSubmitted && this.validateQuestion(obj);
      const formData = new FormData();
      formData.append('file', file);

      obj.uploadStatus = 'File uploading please wait....';

      this.service
        .httpRequest(
          `${AssessmentControllerURL.uploadFile}?folderName=${
            Date.now() +
            '_' +
            this.categoryList.templateUploadedUserId +
            '_' +
            obj.questionId
          }`,
          'post',
          formData
        )
        .subscribe({
          next: (res: any) => {
            if (res.status === '200') {
              obj.uploadStatus = 'File Upload Successfully!!!';
              obj.answerValue = [
                `${environment.BASE_URL}/ee-dashboard/api/v1/download/${
                  res.folderName + '/' + res.filename
                }`,
              ];
            }
          },
          error: (err) => {
            obj.uploadStatus = 'Upload Failed!!!';
          },
          complete: () => {
            delete obj.uploadStatus;
            delete obj.tempfileUri;
            delete obj.selectedFile;
          },
        });
    }
  }

  downloadFile(question: any, fileName: string): void {
    this.service.getFileDownLoad(question.answerValue[0]).subscribe({
      next: (data: any) => {
        new Blob([data]);
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        link.click();
      },
      error: (err) => {
        console.log('err', err);
      },
      complete: () => {},
    });
  }

  validateQuestion(question: any) {
    if (question.answerOptionIndex) {
      question['isValid'] = true;
      return true;
    }
    question['isValid'] = false;
    return false;
  }

  clearSelectedFile(obj: any): void {
    //this.is_Submitted && this.validateQuestion(obj);

    if (obj.answerValue) {
      //api call

      const dialogRef = this.dialog.open(ConsentPopupComponent, {
        data: { name: 'Are you sure you want to delete this file?' },
      });

      dialogRef.afterClosed().subscribe((result: string) => {
        if (result === 'yes') {
          this.service
            .httpRequest(
              `${AssessmentControllerURL.deleteFile}?fileName=${
                obj.answerValue[0].split('/')[
                  obj.answerValue[0].split('/').length - 1
                ]
              }&folderName=${
                obj.answerValue[0].split('/')[
                  obj.answerValue[0].split('/').length - 2
                ]
              }`,
              'delete'
            )
            .subscribe({
              next: (res) => {
                const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
                  data: {
                    status: 'success',
                    heading: 'File Deleted Successfully!!!',
                    subHeading: '',
                    buttonText: 'OK',
                  },
                });
                dialogRef.afterClosed().subscribe((result: string) => {
                  if (result === 'yes') delete obj.answerValue;
                });
              },
              error: (err) => {
                const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
                  data: {
                    status: 'failure',
                    heading: 'Problem deleting this file!!!',
                    subHeading: '',
                    buttonText: 'OK',
                  },
                });
                console.log('error', err);
              },
              complete: () => {},
            });
        }
      });
    } else {
      delete obj.tempfileUri;
    }

    delete obj.selectedFile;
  }
}
