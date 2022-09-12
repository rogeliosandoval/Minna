import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription} from 'rxjs';
import { AuthService } from '../../services/auth.service'
import { DatabaseService } from "src/app/services/database.service";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})

export class CreatePost implements OnInit, OnDestroy {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)
    username: any;
    email: any;
    isProgressVisible: boolean;
    postForm: FormGroup;
    firebaseErrorMessage: string;
    postSubscription!: Subscription;
    fadeForm = false;
    modalSuccess = false;
    errorMessage: any;
    currentDate: any;

    // Post Colors
    bgBluePost = false;
    bgGreenPost = false;
    bgYellowPost = false;
    bgBrownPost = false;
    bgPurplePost = false;
    bgPinkPost = false;
    bgGreyPost = false;
    bgRedPost = false;
    bgDefaultPost = true;

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore, private afAuth: AuthService, private db: AngularFireDatabase, private dbservice: DatabaseService, private router: Router, private route: ActivatedRoute, public datepipe: DatePipe) {
        let currentDateTime = this.datepipe.transform((new Date), 'short');
        this.user = fireAuth.user;
        this.isProgressVisible = false;
        
        this.postForm = new FormGroup({
            'name': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required]),
            'date': new FormControl('', [Validators.required]),
            'author': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required, Validators.maxLength(3000)])
        });
        
        this.firebaseErrorMessage = '';
        this.currentDate = currentDateTime;

    }

    get name() {
        return this.postForm.get('name');
    }
    
    get author() {
        return this.postForm.get('author');
    }

    get color() {
        return this.postForm.get('color');
    }
    
    get title() {
        return this.postForm.get('title');
    }
    
    get message() {
        return this.postForm.get('message');
    }
    
    async createPost() {
        try {
            this.fadeForm = true;
            this.isProgressVisible = true;
            const ref = this.db.list("posts");
            await ref.push(this.postForm.value);
    
            setTimeout(() => {
                this.isProgressVisible = false;
                this.modalSuccess = true;
                // this "refreshes" the component so that the data updates on the DOM
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    // this.router.onSameUrlNavigation = 'reload';
                    // this.router.navigate(['./'], {
                    //     relativeTo: this.route
                    //     queryParamsHandling: 'merge'  // keep params on reload
                    // })
                }, 2500)
            }, 1000)
        } catch (error) {
            this.fadeForm = false;
            this.isProgressVisible = false;
            this.errorMessage = 'Something went wrong, try again.';
            console.log(error);
        }
    }
    
    ngOnInit(): void {
        try{
            this.fireAuth.authState.subscribe(user => {
                // console.log('Dashboard: user', user);
                
                if (user) {
                    let emailLower = user.email?.toLowerCase();
                    this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                    this.username = user.displayName;
                    this.email = user.email;
                }
                
            });
    
            setTimeout(() => {
                this.postForm.get('name')?.setValue(this.username);
                this.postForm.get('email')?.setValue(this.email);
                this.postForm.get('date')?.setValue(this.currentDate);
                this.postForm.get('color')?.setValue('default');
            }, 1000);
        } catch (error) {
            console.log(error);
        }
        
    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    useName() {
        this.postForm.get('author')?.setValue(this.username);
    }

    hideName() {
        this.postForm.get('author')?.setValue('Anonymous');
    }

    bluePost() {
        this.postForm.get('color')?.setValue('blue');
        this.bgBluePost = true;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    greenPost() {
        this.postForm.get('color')?.setValue('green');
        this.bgGreenPost = true;
        this.bgBluePost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    yellowPost() {
        this.postForm.get('color')?.setValue('yellow');
        this.bgYellowPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    brownPost() {
        this.postForm.get('color')?.setValue('brown');
        this.bgBrownPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    purplePost() {
        this.postForm.get('color')?.setValue('purple');
        this.bgPurplePost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    pinkPost() {
        this.postForm.get('color')?.setValue('pink');
        this.bgPinkPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    greyPost() {
        this.postForm.get('color')?.setValue('grey');
        this.bgGreyPost = true;
        this.bgPinkPost = false;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    redPost() {
        this.postForm.get('color')?.setValue('red');
        this.bgRedPost = true;
        this.bgPinkPost = false;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgGreyPost = false;
        this.bgDefaultPost = false;
    }

    defaultPost() {
        this.postForm.get('color')?.setValue('default');
        this.bgDefaultPost = true;
        this.bgPinkPost = false;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}