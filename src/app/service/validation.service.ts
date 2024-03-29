import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  public savedRatings: Subject<any> = new Subject();
  public reportsFilter: Subject<any> = new Subject();
  public getSavedRatings: any;
  public getSavedComments: any;

  constructor() {}
  passValue(data: any) {
    //passing the data as the next observable
    this.savedRatings.next(data);
  }
  passReportsFilterValue(data: any) {
    //passing the data as the next observable
    this.reportsFilter.next(data);
  }
  static greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value === null || value === undefined) {
        return null;
      }
      return value > 0 ? null : { greaterThanZero: true };
    };
  }

  static isGreaterThanFrom(fromControlName: string): ValidatorFn {
    return (toControl: AbstractControl): ValidationErrors | null => {
      if (!toControl || toControl.root === null) {
        return null;
      }

      const fromControl = toControl.root.get(fromControlName);

      if (
        !fromControl ||
        fromControl.value === null ||
        toControl.value === null
      ) {
        return null;
      }

      const fromValue = +fromControl.value;
      const toValue = +toControl.value;

      if (fromValue >= toValue) {
        return { isGreaterThanFrom: true };
      }

      return null;
    };
  }
}
