import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class Home implements OnInit {

    constructor(public fireAuth: AngularFireAuth, private afs: AngularFirestore) {

    }

    ngOnInit(): void {

    }

    logout(): void {
        this.fireAuth.signOut();
    }


}