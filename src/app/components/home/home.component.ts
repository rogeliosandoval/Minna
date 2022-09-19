import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from "src/app/services/auth.service";
import { Observable, Subscription } from 'rxjs';
import { DatabaseService } from "src/app/services/database.service";
import { IPost } from "src/app/models/IPost";
import { IComment } from "src/app/models/IComment";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class Home implements OnInit {

    user: Observable<any>;
    username: any;
    postSubscription!: Subscription;
    postData: IPost[] = [];
    notification = false;
    new: IPost[] = [];
    userData: IPost[] = [];
    showNotif = false;

    constructor(public fireAuth: AngularFireAuth, private afs: AngularFirestore, private afAuth: AuthService, private dbservice: DatabaseService) {
        this.user = fireAuth.user;
    }

    ngOnInit(): void {
        this.fireAuth.authState.subscribe(user => {
            if (user) {
                let emailLower = user.email?.toLowerCase();
                this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                this.username = user.displayName;
            }
        })

        this.postSubscription = this.dbservice.getPosts().subscribe(data => {
            this.postData = data;
        });
        
        setTimeout(() => {
            this.userData = this.postData.filter(data => data.name === this.username);

            this.new = this.userData.filter(data => data.newComment === true)

            if(this.new.length > 0) {
                this.notification = true;
            } else {
                this.notification = false;
            }

        }, 600)
    }

    // test() {
    //     console.log(this.postData);
    // }

    openNotification() {
        this.showNotif = true;
    }

    closeNotification() {
        this.showNotif = false;
    }

    logout(): void {
        this.afAuth.logoutUser();
    }


}