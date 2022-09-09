import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service'
import { DatabaseService } from "src/app/services/database.service";
import { IPost } from "src/app/models/IPost";

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class Profile implements OnInit, OnDestroy {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)
    username: any;
    postData: IPost[] = [];
    userData: IPost[] = [];
    postSubscription!: Subscription;
    showPosts = false;
    showAdd = false;

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore, private afAuth: AuthService, private dbservice: DatabaseService) {
        this.user = fireAuth.user;
    }
    
    ngOnInit(): void {
        this.fireAuth.authState.subscribe(user => {
            // console.log('Dashboard: user', user);
            
            if (user) {
                let emailLower = user.email?.toLowerCase();
                this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                this.username = user.displayName;
            }
            
        });
        
        this.postSubscription = this.dbservice.getPosts().subscribe(data => {
            this.postData = data;
        })

        setTimeout(() => {
            this.userData = this.postData.filter(data => data.name === this.username);
            if (this.userData.length === 0){
                this.showAdd = true;
            } else {
                this.showPosts = true;
            }
        }, 500)
        
    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}