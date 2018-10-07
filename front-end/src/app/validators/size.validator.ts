import { AbstractControl } from '@angular/forms';

export function ValidateSize(control: AbstractControl) {
  if (control.value.filesize > 1000000) {
    	return { validSize: true };
  }
  return null;
}