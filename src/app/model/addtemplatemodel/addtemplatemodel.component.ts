import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HTTPService } from 'src/app/service/http.service';
import { ValidationService } from 'src/app/service/validation.service';

@Component({
  selector: 'app-addtemplatemodel',
  templateUrl: './addtemplatemodel.component.html',
  styleUrls: ['./addtemplatemodel.component.css'],
})
export class AddtemplatemodelComponent implements OnInit {
  submitted = true;
  scoreTypes = [
    { id: 1, value: 'Single Value', type: 'singleValue' },
    { id: 2, value: 'Range', type: 'multiValue' },
  ];

  selectedOption = 0;
  isRange = false;

  reqPayload: any = {};
  rangeArray: object[] = [];
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    private service: HTTPService
  ) {}

  ngOnInit() {}

  addScoreForm = new FormGroup({
    scoreName: new FormControl('', [Validators.required]),
    from1: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
      ValidationService.greaterThanZeroValidator(),
    ]),
    from2: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('to1'),
    ]),
    from3: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('to2'),
      ValidationService.isGreaterThanFrom('to1'),
    ]),
    from4: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('to3'),
      ValidationService.isGreaterThanFrom('to2'),
      ValidationService.isGreaterThanFrom('to1'),
    ]),
    from5: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('to4'),
      ValidationService.isGreaterThanFrom('to3'),
      ValidationService.isGreaterThanFrom('to2'),
      ValidationService.isGreaterThanFrom('to1'),
    ]),
    to1: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.isGreaterThanFrom('from1'),
    ]),
    to2: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('from2'),
    ]),
    to3: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('from3'),
    ]),
    to4: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('from4'),
    ]),
    to5: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]*$'),
      ValidationService.greaterThanZeroValidator(),
      ValidationService.isGreaterThanFrom('from5'),
    ]),
  });

  updateToValue(e: any, controlName: string) {
    const to1Control = this.addScoreForm.get('to1');
    const to2Control = this.addScoreForm.get('to2');
    const to3Control = this.addScoreForm.get('to3');
    const to4Control = this.addScoreForm.get('to4');
    const to5Control = this.addScoreForm.get('to5');

    if (this.selectedOption == 1) {
      if (to1Control && controlName === 'to1') {
        to1Control.setValue(e.target.value);
      }
      if (to2Control && controlName === 'to2') {
        to2Control.setValue(e.target.value);
      }
      if (to3Control && controlName === 'to3') {
        to3Control.setValue(e.target.value);
      }
      if (to4Control && controlName === 'to4') {
        to4Control.setValue(e.target.value);
      }
      if (to5Control && controlName === 'to5') {
        to5Control.setValue(e.target.value);
      }
      this.addScoreForm.updateValueAndValidity();
    }
  }

  changeOption(e: any) {
    this.selectedOption = e.target.value;

    this.isRange = this.selectedOption == 2;

    if (this.isRange) {
      this.setToFieldValidations(true);
    } else {
      this.setToFieldValidations(false);
    }

    this.addScoreForm.reset();
  }

  setToFieldValidations(enableValidations: boolean) {
    const to1Control = this.addScoreForm.get('to1');
    const to2Control = this.addScoreForm.get('to2');
    const to3Control = this.addScoreForm.get('to3');
    const to4Control = this.addScoreForm.get('to4');
    const to5Control = this.addScoreForm.get('to5');

    if (enableValidations) {
      to1Control?.setValidators([
        Validators.required,
        Validators.pattern('^[1-9][0-9]*'),
        ValidationService.isGreaterThanFrom('from1'),
      ]);
      to2Control?.setValidators([
        Validators.required,
        Validators.pattern('^[1-9][0-9]*'),
        ValidationService.greaterThanZeroValidator(),
        ValidationService.isGreaterThanFrom('from2'),
      ]);
      to3Control?.setValidators([
        Validators.required,
        Validators.pattern('^[1-9][0-9]*'),
        ValidationService.greaterThanZeroValidator(),
        ValidationService.isGreaterThanFrom('from3'),
      ]);
      to4Control?.setValidators([
        Validators.required,
        Validators.pattern('^[1-9][0-9]*'),
        ValidationService.greaterThanZeroValidator(),
        ValidationService.isGreaterThanFrom('from4'),
      ]);
      to5Control?.setValidators([
        Validators.required,
        Validators.pattern('^[1-9][0-9]*'),
        ValidationService.greaterThanZeroValidator(),
        ValidationService.isGreaterThanFrom('from5'),
      ]);
    } else {
      to1Control?.setValidators(null);
      to2Control?.setValidators(null);
      to3Control?.setValidators(null);
      to4Control?.setValidators(null);
      to5Control?.setValidators(null);
    }

    to1Control?.updateValueAndValidity();
    to2Control?.updateValueAndValidity();
    to3Control?.updateValueAndValidity();
    to4Control?.updateValueAndValidity();
    to5Control?.updateValueAndValidity();
  }

  onSubmit(data: any) {
    this.submitted = true;

    if (this.addScoreForm.valid) {
      const scoreName = this.addScoreForm.get('scoreName')?.value;

      this.reqPayload = {
        name: scoreName,
        scoreScaleType: '',
        createdUserId: 11,
        range: [],
      };

      if (this.selectedOption == 1) {
        this.reqPayload.scoreScaleType = this.scoreTypes[0].type;
      }

      if (this.selectedOption == 2) {
        this.reqPayload.scoreScaleType = this.scoreTypes[1].type;
      }

      for (let i = 1; i <= 5; i++) {
        const fromControl = this.addScoreForm.get(`from${i}`);
        const toControl = this.addScoreForm.get(`to${i}`);

        if (fromControl && toControl) {
          const fromValue = fromControl.value;
          const toValue = toControl.value;

          if (fromValue !== null && toValue !== null) {
            const optionObj: {} = {
              from: fromValue,
              to: toValue,
              optionIndex: i,
            };
            this.reqPayload.range.push(optionObj);
          }
        }
      }
      this.data = this.reqPayload;
      this.service
        .httpRequest(
          '/ee-dashboard/api/v1/addScoreScale',
          'POST',
          this.reqPayload
        )
        .subscribe({});
      this.modalRef.hide();
    }
  }
}
