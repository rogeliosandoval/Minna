import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service'
import { DatabaseService } from "src/app/services/database.service";
import { INote } from "src/app/models/INote";
import { IPost } from "src/app/models/IPost";
import { HotToastService } from '@ngneat/hot-toast';
import { Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'notebook',
    templateUrl: './notebook.component.html',
    styleUrls: ['./notebook.component.scss']
})

export class Notebook implements OnInit, OnDestroy {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)
    username: any;
    noteData: INote[] = [];
    userNoteData: INote[] = [];
    postSubscription!: Subscription;
    showNotes = false;
    showAdd = false;
    pageLoading = true;
    p: number = 1;
    currentPage: any;
    searchText = '';
    notification = false;
    new: IPost[] = [];
    postData: IPost[] = [];
    userData: IPost[] = [];
    showNotif = false;

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore, private afAuth: AuthService, private dbservice: DatabaseService, private route: ActivatedRoute, private router: Router, private toast: HotToastService) {
        this.user = fireAuth.user;
    }
    
    ngOnInit(): void {
        
        try{
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
            });
            
            this.postSubscription = this.dbservice.getNotes().subscribe(data => {
                this.noteData = data.reverse();
            })
    
            setTimeout(() => {
                this.pageLoading = false;

                this.userData = this.postData.filter(data => data.name === this.username);

                this.new = this.userData.filter(data => data.newComment === true)
    
                if(this.new.length > 0) {
                    this.notification = true;
                } else {
                    this.notification = false;
                }

                this.userNoteData = this.noteData.filter(data => data.name === this.username);
                if (this.userNoteData.length === 0){
                    this.showAdd = true;
                } else {
                    this.noteData = this.userNoteData;
                    this.showNotes = true;
                }
            }, 600);
        } catch (error) {
            console.log(error);
        }

    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    // scrolls user back to the top on pagination change
    onPageChange(page: number) {
        this.currentPage = page;
        window.scrollTo(0,0);
    }

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