import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription} from 'rxjs';
import { AuthService } from '../../services/auth.service'
import { DatabaseService } from "src/app/services/database.service";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IPost } from "src/app/models/IPost";
import { ActivatedRoute, Router } from "@angular/router";

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
    postData: IPost[] = [];
    postSubscription!: Subscription;
    fadeForm = false;
    modalSuccess = false;

    bgBluePost = false;
    bgGreenPost = false;
    bgYellowPost = false;
    bgBrownPost = false;
    bgPurplePost = false;
    bgPinkPost = false;

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore, private afAuth: AuthService, private db: AngularFireDatabase, private dbservice: DatabaseService, private router: Router, private route: ActivatedRoute) {
        this.user = fireAuth.user;
        this.isProgressVisible = false;
        
        this.postForm = new FormGroup({
            'name': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required]),
            'author': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required, Validators.maxLength(3000)])
        });
        
        this.firebaseErrorMessage = '';

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
    
    createPost() {
        this.fadeForm = true;
        this.isProgressVisible = true;
        const ref = this.db.list("posts");
        ref.push(this.postForm.value);

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
    }
    
    ngOnInit(): void {
        this.fireAuth.authState.subscribe(user => {
            // console.log('Dashboard: user', user);
            
            if (user) {
                let emailLower = user.email?.toLowerCase();
                this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                this.username = user.displayName;
                this.email = user.email;
            }
            
        });
        
        this.postSubscription = this.dbservice.getPosts().subscribe(data => {
            this.postData = data;
        })

        setTimeout(() => {
            this.postForm.get('name')?.setValue(this.username);
            this.postForm.get('email')?.setValue(this.email);
        }, 1000)
        
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
    }

    greenPost() {
        this.postForm.get('color')?.setValue('green');
        this.bgGreenPost = true;
        this.bgBluePost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
    }

    yellowPost() {
        this.postForm.get('color')?.setValue('yellow');
        this.bgYellowPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
    }

    brownPost() {
        this.postForm.get('color')?.setValue('brown');
        this.bgBrownPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
    }

    purplePost() {
        this.postForm.get('color')?.setValue('purple');
        this.bgPurplePost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPinkPost = false;
    }

    pinkPost() {
        this.postForm.get('color')?.setValue('pink');
        this.bgPinkPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}