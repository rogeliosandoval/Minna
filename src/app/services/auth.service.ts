import { AnimationDriver } from '@angular/animations/browser';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userLoggedIn: boolean | undefined;

  constructor(private router: Router, private fireAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.userLoggedIn = false;

    this.fireAuth.onAuthStateChanged((user) => { // set up a subscription to always know the login status of the user
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Auth Service: loginUser: success');  // this.router.navigate(['/dashboard']);
    })
    .catch(error => {
      console.log('Auth Service: login error...');
      console.log('error code', error.code);
      console.log('error', error);
      return { isValid: false, message: error.message };
      // if (error.code)
    });
  }

  signupUser(user: any): Promise<any> {
    return this.fireAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then((result) => {
      let emailLower = user.email.toLowerCase();

      this.afs.doc('/users/' + emailLower)  // on a successful signup, create a document in 'users' collection with the new user's info
        .set({
          accountType: 'endUser',
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.firstName + " " + user.lastName,
          displayName: user.firstName,
          displayName_lower: user.firstName.toLowerCase() + " " + user.lastName.toLowerCase(),
          email: user.email,
          email_lower: emailLower,
          isAdmin: false
        });
      result.user?.sendEmailVerification();  // immediately send the user a verification email
      result.user?.updateProfile({displayName: user.firstName})
    })
    .catch(error => {
      console.log('Auth Service: signup error', error);
      return { isValid: false, message: error.message };
      // if (error.code)
    });
  }

  resetPassword(email: string): Promise<any> {
    return this.fireAuth.sendPasswordResetEmail(email)
    .then(() => {
      console.log('Auth Service: reset password success');  // this.router.navigate(['/amount']);
    })
    .catch(error => {
      console.log('Auth Service: reset password error...');
      console.log(error.code);
      console.log(error)
      if (error.code)
        return error;
    });
  }

  async resendVerificationEmail() {  // verification email is sent in the Sign Up function, but if you need to resend, call this function
    return (await this.fireAuth.currentUser)?.sendEmailVerification()
    .then(() => {
      // this.router.navigate(['home']);
    })
    .catch(error => {
        console.log('Auth Service: sendVerificationEmail error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code)
          return error;
    });
  }

  logoutUser(): Promise<void> {
    return this.fireAuth.signOut()
    .then(() => {
      this.router.navigate(['/logout']);  // when we log the user out, navigate them to home
    })
    .catch(error => {
      console.log('Auth Service: logout error...');
      console.log('error code', error.code);
      console.log('error', error);
      if (error.code)
        return error;
    });
  }

  setUserInfo(payload: object) {
    console.log('Auth Service: saving user info...');
    this.afs.collection('users')
    .add(payload).then(function (res) {
      console.log("Auth Service: setUserInfo response...")
      console.log(res);
    })
  }

  getCurrentUser() {
    return this.fireAuth.currentUser;  // returns user object for logged-in users, otherwise returns null 
  }

}
