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
    searchText = '';
    p: number = 1;
    currentPage: any;
    pageLoading = true;
    pageLoadingTwo = true;
    keysToExclude: any [] = [null];
    postsExist = false;
    showAdd = false;

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore, private afAuth: AuthService, private dbservice: DatabaseService) {
        this.user = fireAuth.user;
    }
    
    ngOnInit(): void {
        try {
            this.pageLoading = false;
            this.fireAuth.authState.subscribe(user => {
                // console.log('Dashboard: user', user);
                
                if (user) {
                    let emailLower = user.email?.toLowerCase();
                    this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                    this.username = user.displayName;
                }

                this.postSubscription = this.dbservice.getPosts().subscribe(data => {
                    this.postData = data.reverse();
                });
                
                setTimeout(() => {
                    this.pageLoadingTwo = false;
                    if (this.postData.length === 0){
                        this.showAdd = true;
                    } else {
                        this.postsExist = true;
                    }
                }, 600);
                
            });
            
        } catch (error) {
            console.log(error);
        }
        
    }

    // scrolls user back to the top on pagination change
    onPageChange(page: number) {
        this.currentPage = page;
        window.scrollTo(0,0);
    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}