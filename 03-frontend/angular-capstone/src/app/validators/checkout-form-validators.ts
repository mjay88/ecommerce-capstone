import { FormControl, ValidationErrors } from "@angular/forms";

export class CheckoutFormValidators {

    //whitespace validations
    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        
        //check if string is only whitespace
        if((control.value != null) && (control.value.trim().length === 0)){
            return { 'notOnlyWhitespace': true };
        } else {
            return null;
        }
    }
  
}
