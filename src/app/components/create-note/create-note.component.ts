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
    selector: 'create-note',
    templateUrl: './create-note.component.html',
    styleUrls: ['./create-note.component.scss']
})

export class CreateNote implements OnInit, OnDestroy {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)
    username: any;
    email: any;
    isProgressVisibleNote: boolean;
    noteForm: FormGroup;
    postSubscription!: Subscription;
    fadeNoteForm = false;
    modalSuccess = false;
    errorMessageNote: any;
    currentDate: any;

    // Note colors
    bgDefaultNote = true;
    bgGreenNote = false;
    bgRedNote = false;
    bgBlueNote = false;
    bgGreyNote = false;
    bgPinkNote = false;

    constructor(public fireAuth: AngularFireAuth, public afs: AngularFirestore, private afAuth: AuthService, private db: AngularFireDatabase, private dbservice: DatabaseService, private router: Router, private route: ActivatedRoute, public datepipe: DatePipe) {

        this.user = fireAuth.user;
        this.isProgressVisibleNote = false;

        this.noteForm = new FormGroup({
            'name': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required]),
            'date': new FormControl(''),
            'title': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required])
        })

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
                this.noteForm.get('name')?.setValue(this.username);
                this.noteForm.get('email')?.setValue(this.email);
                this.noteForm.get('color')?.setValue('default');
            }, 1000);
        } catch (error) {
            console.log(error);
        }
        
    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    get title() {
        return this.noteForm.get('title');
    }

    get message() {
        return this.noteForm.get('message');
    }

    async createNote() {
        try{
            this.fadeNoteForm = true;
            this.isProgressVisibleNote = true;
            let currentDateTime = this.datepipe.transform((new Date), 'short');
            this.currentDate = currentDateTime;
            this.noteForm.get('date')?.setValue(this.currentDate);
            const ref = this.db.list("notes");
            await ref.push(this.noteForm.value);
            setTimeout(() => {
                this.isProgressVisibleNote = false;
                this.modalSuccess = true;
                // this "refreshes" the component so that the data updates on the DOM
                setTimeout(() => {
                    this.router.navigate(['/notebook']);
                    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    // this.router.onSameUrlNavigation = 'reload';
                    // this.router.navigate(['./'], {
                    //     relativeTo: this.route
                    //     queryParamsHandling: 'merge'  // keep params on reload
                    // })
                }, 2500)
            }, 1000)
        } catch (error) {
            this.fadeNoteForm = false;
            this.isProgressVisibleNote = false;
            this.errorMessageNote = 'Something went wrong creating your note, please try again';
            console.log(error);
        }
    }

    defaultNote() {
        this.noteForm.get('color')?.setValue('default');
        this.bgDefaultNote = true;
        this.bgGreenNote = false;
        this.bgRedNote = false;
        this.bgBlueNote = false;
        this.bgGreyNote = false;
        this.bgPinkNote = false;
    }

    greenNote() {
        this.noteForm.get('color')?.setValue('green');
        this.bgGreenNote = true;
        this.bgDefaultNote = false;
        this.bgRedNote = false;
        this.bgBlueNote = false;
        this.bgGreyNote = false;
        this.bgPinkNote = false;
    }

    redNote() {
        this.noteForm.get('color')?.setValue('red');
        this.bgRedNote = true;
        this.bgGreenNote = false;
        this.bgDefaultNote = false;
        this.bgBlueNote = false;
        this.bgGreyNote = false;
        this.bgPinkNote = false;
    }

    blueNote() {
        this.noteForm.get('color')?.setValue('blue');
        this.bgBlueNote = true;
        this.bgGreenNote = false;
        this.bgDefaultNote = false;
        this.bgRedNote = false;
        this.bgGreyNote = false;
        this.bgPinkNote = false;
    }

    greyNote() {
        this.noteForm.get('color')?.setValue('grey');
        this.bgGreyNote = true;
        this.bgGreenNote = false;
        this.bgDefaultNote = false;
        this.bgRedNote = false;
        this.bgBlueNote = false;
        this.bgPinkNote = false;
    }

    pinkNote() {
        this.noteForm.get('color')?.setValue('pink');
        this.bgPinkNote = true;
        this.bgGreenNote = false;
        this.bgDefaultNote = false;
        this.bgRedNote = false;
        this.bgBlueNote = false;
        this.bgGreyNote = false;
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}