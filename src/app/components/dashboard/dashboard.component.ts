import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service'
import { DatabaseService } from "src/app/services/database.service";
import { IPost } from "src/app/models/IPost";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class Dashboard implements OnInit, OnDestroy {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)
    username: any;
    postData: IPost[] = [];
    postSubscription!: Subscription;

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
        
    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}