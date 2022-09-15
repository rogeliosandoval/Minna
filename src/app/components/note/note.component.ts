import { Component, OnDestroy, OnInit} from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { AuthService } from "src/app/services/auth.service";
import { DatePipe } from '@angular/common';
import { HotToastService } from "@ngneat/hot-toast";

@Component({
    selector: 'note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss']
})

export class Note implements OnInit, OnDestroy {

    user: Observable<any>;
    id = this.route.snapshot.params['id'];
    name: any;
    email: any;
    editForm: FormGroup;
    noteData: any;
    isProgressVisibleUpdate: boolean;
    isProgressVisibleDelete: boolean;
    firebaseErrorMessage: string;
    errorMessageDelete: any;
    errorMessageUpdate: any;
    errorMessageRefresh: any;
    postSubscription!: Subscription;
    fadeEditForm = false;;
    fadePost = true;
    deleteNoteModal = false;
    modalSuccess = false;
    showME = false;
    pageLoading = true;
    currentDate: any;
    currentDateEdit: any;
    p: number = 1;
    currentPage: any;
    searchText = '';
    avatarURL: any;
    showEdit = false;

    // colors for the post
    bgBluePost = false;
    bgGreenPost = false;
    bgYellowPost = false;
    bgBrownPost = false;
    bgPurplePost = false;
    bgPinkPost = false;
    bgGreyPost = false;
    bgRedPost = false;
    bgDefaultPost = false;

    constructor(private route: ActivatedRoute, private router: Router, private dbservice: DatabaseService, public fireAuth: AngularFireAuth, private afs: AngularFirestore, private db: AngularFireDatabase, private afAuth: AuthService, public datepipe: DatePipe, private toast: HotToastService){
        this.user = fireAuth.user;
        this.isProgressVisibleUpdate = false;
        this.isProgressVisibleDelete = false;

        this.editForm = new FormGroup({
            'isEdited': new FormControl('', [Validators.required]),
            'date': new FormControl(''),
            'color': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required, Validators.maxLength(3000)])
        });

        this.firebaseErrorMessage = '';

    }
    
    ngOnInit(): void {
        try{
            this.fireAuth.authState.subscribe(user => {
                if (user) {
                    let emailLower = user.email?.toLowerCase();
                    this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                    this.name = user.displayName;
                    this.email = user.email;
                    this.avatarURL = user.photoURL;
                }
            })

            this.postSubscription = this.dbservice.getNotesById(this.id).subscribe(data => {
                this.noteData = data;
            })
    
            setTimeout(() => {
                try{

                    if (this.noteData.isEdited === true) {
                        this.showEdit = true;
                    } else {
                        this.showEdit = false;
                    }

                    this.fadePost = false;
                    this.pageLoading = false;
                    this.changeColor();
                    this.editForm.get('isEdited')?.setValue(true);
                    this.editForm.get('color')?.setValue(this.noteData.color);
                    this.editForm.get('title')?.setValue(this.noteData.title);
                    this.editForm.get('message')?.setValue(this.noteData.message);
                } catch (error) {
                    this.errorMessageRefresh = 'Something went wrong. Try refreshing the page.'
                    console.log(error);
                }
    
            },1000);
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
    
    get title() {
        return this.editForm.get('title');
    }
    
    get message() {
        return this.editForm.get('message');
    }

    // switch case to update the post's color on load
    changeColor(color = this.noteData.color) {
        switch(color) {
            case "blue":
                this.bluePost();
                break
            case "green":
                this.greenPost();
                break;
            case "yellow":
                this.yellowPost();
                break;
            case "brown":
                this.brownPost();
                break;
            case "purple":
                this.purplePost();
                break;
            case "pink":
                this.pinkPost();
                break;
            case "grey":
                this.greyPost();
                break;
            case "red":
                this.redPost();
                break;
            case "default":
                this.defaultPost();
                break;
        }
    }

    bluePost() {
        this.editForm.get('color')?.setValue('blue');
        this.bgBluePost = true;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    greenPost() {
        this.editForm.get('color')?.setValue('green');
        this.bgGreenPost = true;
        this.bgBluePost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    yellowPost() {
        this.editForm.get('color')?.setValue('yellow');
        this.bgYellowPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    brownPost() {
        this.editForm.get('color')?.setValue('brown');
        this.bgBrownPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    purplePost() {
        this.editForm.get('color')?.setValue('purple');
        this.bgPurplePost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPinkPost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    pinkPost() {
        this.editForm.get('color')?.setValue('pink');
        this.bgPinkPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    greyPost() {
        this.editForm.get('color')?.setValue('grey');
        this.bgGreyPost = true;
        this.bgPinkPost = false;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgRedPost = false;
        this.bgDefaultPost = false;
    }

    redPost() {
        this.editForm.get('color')?.setValue('red');
        this.bgRedPost = true;
        this.bgPinkPost = false;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgGreyPost = false;
        this.bgDefaultPost = false;
    }

    defaultPost() {
        this.editForm.get('color')?.setValue('default');
        this.bgDefaultPost = true;
        this.bgPinkPost = false;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgGreyPost = false;
        this.bgRedPost = false;
    }

    async onUpdate() {
        try {
            this.fadeEditForm = true;
            this.isProgressVisibleUpdate = true;
            let currentDateTime = this.datepipe.transform((new Date), 'short');
            this.currentDateEdit = currentDateTime;
            this.editForm.get('date')?.setValue(this.currentDateEdit);
            await this.db.object("/notes/"+this.id).update({
                isEdited: this.editForm.controls["isEdited"].value,
                date: this.editForm.controls["date"].value,
                color: this.editForm.controls["color"].value,
                title: this.editForm.controls["title"].value,
                message: this.editForm.controls["message"].value
            })
            setTimeout(() => {
                this.toast.success("Note updated successfully", {
                    style: {
                    border: '2px solid #dff5ff',
                    padding: '16px',
                    color: 'black',
                }});
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['./'], {
                    relativeTo: this.route,
                    queryParamsHandling: 'merge'  // keep params on reload
                })
            }, 1000)
        } catch (error) {
            this.fadeEditForm = false;
            this.isProgressVisibleUpdate = false;
            this.errorMessageUpdate = 'Something went wrong, try again.'
            console.log(error);
        }
    }

    // triggers the modal to appear
    onDeleteNote() {
        this.deleteNoteModal = true;
    }

    // removes the modal
    removeModal() {
        this.deleteNoteModal = false;
    }

    // function that does the actual deletion of a post
    async deletePost() {
        try{
            this.deleteNoteModal = false;
            this.fadePost = true;
            this.isProgressVisibleDelete = true;
            await this.dbservice.deleteNote(this.id);
            setTimeout(() => {
                this.isProgressVisibleDelete = false;
                this.modalSuccess = true;
                setTimeout(() => {
                    this.router.navigate(['/notebook']);
                }, 2000)
            }, 1000)
        } catch (error) {
            this.fadePost = false;
            this.isProgressVisibleDelete = false;
            this.errorMessageDelete = 'Something went wrong, try again.'
            console.log(error);
        }
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}