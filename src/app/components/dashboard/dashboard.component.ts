import { Component } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class Dashboard {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore) {
        this.user = fireAuth.user;
    }

    ngOnInit(): void {
        this.fireAuth.authState.subscribe(user => {
            console.log('Dashboard: user', user);

            if (user) {
                let emailLower = user.email?.toLowerCase();
                this.user = this.afs.collection('users').doc(emailLower).valueChanges();
            }
        });
    }


}