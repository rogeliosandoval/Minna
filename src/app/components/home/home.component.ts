import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from "src/app/services/auth.service";
import { Observable } from 'rxjs';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class Home implements OnInit {

    user: Observable<any>;

    constructor(public fireAuth: AngularFireAuth, private afs: AngularFirestore, private afAuth: AuthService) {
        this.user = fireAuth.user;
    }

    ngOnInit(): void {
        this.fireAuth.authState.subscribe(user => {
            if (user) {
                let emailLower = user.email?.toLowerCase();
                this.user = this.afs.collection('users').doc(emailLower).valueChanges();
            }
        })
    }

    logout(): void {
        this.afAuth.logoutUser();
    }


}