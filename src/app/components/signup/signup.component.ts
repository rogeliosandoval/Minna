import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class Signup {

    isProgressVisible: boolean;
    signupForm!: FormGroup;
    firebaseErrorMessage: string;

    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth, public fb: FormBuilder) {
        this.isProgressVisible = false;
        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        if (this.authService.userLoggedIn) {  // if the user's logged in, navigate them home (NOTE: don't use afAuth.currentUser -- it's never null)
            this.router.navigate(['/home']);
        }

        this.signupForm = this.fb.group({
            'firstName': new FormControl('', Validators.required),
            'lastName': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required),
            'confirmPassword': new FormControl('', [Validators.required])
        }, {
            validators:this.passwordMatch('password', 'confirmPassword')
        });

    }

    get all() {
        return this.signupForm.controls;
    }

    get firstName() {
        return this.signupForm.get('firstName');
    }

    get lastName() {
        return this.signupForm.get('lastName');
    }

    get email() {
        return this.signupForm.get('email');
    }

    get password() {
        return this.signupForm.get('password');
    }

    get confirmPassword() {
        return this.signupForm.get('confirmPassword');
    }

    signup() {
        if (this.signupForm.invalid)  // if there's an error in the form, don't submit it
            return;
        this.isProgressVisible = true;
        this.authService.signupUser(this.signupForm.value).then((result: { isValid: boolean; message: string; } | null) => {
            if (result == null)  // null is success, false means there was an error
                this.router.navigate(['/home']);
            else if (result.isValid == false)
                this.firebaseErrorMessage = result.message;
                this.isProgressVisible = false;  // no matter what, when the auth service returns, we hide the progress indicator
        }).catch(() => {
            this.isProgressVisible = false;
        });
    }

    passwordMatch(password:any, confirmPassword:any) {
        return (formGroup:FormGroup) => {

            const passwordcontrol = formGroup.controls[password];
            const confirmpasswordcontrol = formGroup.controls[confirmPassword];

            if(confirmpasswordcontrol.errors && !confirmpasswordcontrol.errors['passwordMatch']) {
                return;
            }

            if (passwordcontrol.value !== confirmpasswordcontrol.value) {
                confirmpasswordcontrol.setErrors({ passwordMatch: true });
            } else {
                confirmpasswordcontrol.setErrors(null);
            }
        }
    }

}