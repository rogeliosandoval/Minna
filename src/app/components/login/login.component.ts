import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class Login {

    isProgressVisible: boolean;
    loginForm: FormGroup;
    firebaseErrorMessage: string;

    constructor(private authService: AuthService, private router: Router, private fireAuth: AngularFireAuth) {

        this.isProgressVisible = false;

        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', [Validators.required])
        });

        this.firebaseErrorMessage = '';
    }

    ngOnInit(): void {
        if (this.authService.userLoggedIn) {  // if the user's logged in, navigate them home (NOTE: don't use afAuth.currentUser -- it's never null)
            this.router.navigate(['/home']);
        }
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    loginUser() {
        this.isProgressVisible = true;  // show the progress indicator as we start the Firebase login process

        if (this.loginForm.invalid)
            return;

        this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result: { isValid: boolean; message: string; } | null) => {
            this.isProgressVisible = false;  // no matter what, when the auth service returns, we hide the progress indicator
            if (result == null) {  // null is success, false means there was an error
                // console.log('logging in...');
                this.router.navigate(['/home']);  // when the user is logged in, navigate them home
            }
            else if (result.isValid == false) {
                console.log('login error', result);
                this.firebaseErrorMessage = result.message;
            }
        });
    }

}