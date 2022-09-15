import { Component, OnDestroy, OnInit} from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { AuthService } from "src/app/services/auth.service";
import { IComment } from "src/app/models/IComment";
import { DatePipe } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})

export class Post implements OnInit, OnDestroy {

    user: Observable<any>;
    id = this.route.snapshot.params['id'];
    name: any;
    email: any;
    editForm: FormGroup;
    commentForm: FormGroup;
    postData: any;
    commentData: IComment[] = [];
    isProgressVisibleUpdate: boolean;
    isProgressVisibleDelete: boolean;
    isProgressVisibleComment: boolean;
    isProgressVisibleDeleteComment: boolean;
    firebaseErrorMessage: string;
    errorMessageComment: any;
    errorMessageDeleteComment: any;
    errorMessageDelete: any;
    errorMessageUpdate: any;
    errorMessageRefresh: any;
    postSubscription!: Subscription;
    modifyPost = false;
    fadeEditForm = false;
    fadeCommentForm = false;
    fadePost = true;
    fadeComment = false;
    deletePostModal = false;
    deleteCommentModal = false;
    modalSuccess = false;
    showME = false;
    currentUserComments: IComment[] = [];
    commentId: any;
    showComments = false;
    isOwner = false;
    pageLoading = true;
    currentDate: any;
    currentDateComment: any;
    currentDateEdit: any;
    p: number = 1;
    currentPage: any;
    searchText = '';
    avatarURL: any;
    showEdit = false;
    numberOfComments: any;
    showCount = false;

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

    // colors for the comment
    bgDefault = false;
    bgTan = false;
    bgRed = false;
    bgSkyBlue = false;
    bgPink = false;

    constructor(private route: ActivatedRoute, private router: Router, private dbservice: DatabaseService, public fireAuth: AngularFireAuth, private afs: AngularFirestore, private db: AngularFireDatabase, private afAuth: AuthService, public datepipe: DatePipe, private toast: HotToastService){
        this.user = fireAuth.user;
        this.isProgressVisibleUpdate = false;
        this.isProgressVisibleDelete = false;
        this.isProgressVisibleComment = false;
        this.isProgressVisibleDeleteComment = false;

        this.editForm = new FormGroup({
            'commentCount': new FormControl(''),
            'isEdited': new FormControl('', [Validators.required]),
            'date': new FormControl(''),
            'author': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required, Validators.maxLength(3000)])
        });

        this.commentForm = new FormGroup({
            'avatarURL': new FormControl(''),
            'isOwner': new FormControl(''),
            'name': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required]),
            'date': new FormControl(''),
            'id': new FormControl('', [Validators.required]),
            'author': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required])
        })

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
            
            this.postSubscription = this.dbservice.getPostById(this.id).subscribe(data => {
                this.postData = data;
            })
    
            this.postSubscription = this.dbservice.getComments(this.id).subscribe(data => {
                this.commentData = data.reverse();
            })
    
            setTimeout(() => {
                try{
                    this.fadePost = false;
                    this.pageLoading = false;
                    // allows users to edit or delete thir own posts
                    if (this.postData.name === this.name) {
                        this.modifyPost = true;
                        this.isOwner = true;
                    } else {
                        this.modifyPost = false;
                        this.isOwner = false;
                    }

                    // this.commentData.filter((comment) => {
                    //     if (comment.name === this.name) {

                    //     }
                    // })
        
                    this.currentUserComments = this.commentData.map(comment=> {
                        comment.canModify = (comment.name === this.name);
                        return comment;
                    })

                    if (this.postData.isEdited === true) {
                        this.showEdit = true;
                    } else {
                        this.showEdit = false;
                    }
        
                    if (this.commentData.length !== 0) {
                        this.showComments = true;
                    } else {
                        this.showComments = false;
                    }

                    this.numberOfComments = this.commentData.length;
                    this.db.object("/posts/"+this.id).update({
                        commentCount: this.numberOfComments
                    })
                    this.showCount = true;
        
                    this.changeColor();
                    this.editForm.get('isEdited')?.setValue(true)
                    this.editForm.get('author')?.setValue(this.postData.author);
                    this.editForm.get('color')?.setValue(this.postData.color);
                    this.editForm.get('title')?.setValue(this.postData.title);
                    this.editForm.get('message')?.setValue(this.postData.message);
                    this.commentForm.get('id')?.setValue(this.id);
                    this.commentForm.get('name')?.setValue(this.name);
                    this.commentForm.get('email')?.setValue(this.email);
                    this.commentForm.get('color')?.setValue('default');
                    this.commentForm.get('avatarURL')?.setValue(this.avatarURL);

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

    get isEdited() {
        return this.editForm.get('isEdited');
    }
    
    get author() {
        return this.editForm.get('author');
    }
    
    get color() {
        return this.editForm.get('color');
    }
    
    get title() {
        return this.editForm.get('title');
    }
    
    get message() {
        return this.editForm.get('message');
    }
    
    useNameEdit() {
        this.editForm.get('author')?.setValue(this.name);
    }
    
    hideNameEdit() {
        this.editForm.get('author')?.setValue('Anonymous');
    }

    useNameComment() {
        this.commentForm.get('author')?.setValue(this.name);
    }
    
    hideNameComment() {
        this.commentForm.get('author')?.setValue('Anonymous');
    }

    // switch case to update the post's color on load
    changeColor(color = this.postData.color) {
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

    default() {
        this.commentForm.get('color')?.setValue('default');
        this.bgDefault = true;
        this.bgTan = false;
        this.bgRed = false;
        this.bgSkyBlue = false;
        this.bgPink = false;
    }

    tan() {
        this.commentForm.get('color')?.setValue('tan');
        this.bgTan = true;
        this.bgRed = false;
        this.bgSkyBlue = false;
        this.bgPink = false;
    }

    red() {
        this.commentForm.get('color')?.setValue('red');
        this.bgRed = true;
        this.bgTan = false;
        this.bgSkyBlue = false;
        this.bgPink = false;
    }

    skyBlue() {
        this.commentForm.get('color')?.setValue('skyBlue');
        this.bgSkyBlue = true;
        this.bgTan = false;
        this.bgRed = false;
        this.bgPink = false;
    }

    pink() {
        this.commentForm.get('color')?.setValue('pink');
        this.bgPink = true;
        this.bgTan = false;
        this.bgRed = false;
        this.bgSkyBlue = false;
    }

    async onComment() {
        try{
            this.fadeCommentForm = true;
            this.isProgressVisibleComment = true;
    
            // checking to see if user is the author or not
            if(this.postData.name === this.name && this.commentForm.get('author')?.value !== 'Anonymous') {
                this.commentForm.get('isOwner')?.setValue(true);
            } else {
                this.commentForm.get('isOwner')?.setValue(false);
            }

            let currentDateTime = this.datepipe.transform((new Date), 'short');
            this.currentDateComment = currentDateTime;
            this.commentForm.get('date')?.setValue(this.currentDateComment);
    
            const ref = this.db.list("posts/"+this.id+"/comments");
            await ref.push(this.commentForm.value);
            setTimeout(() => {
                this.toast.success("Comment added", {
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
            this.fadeCommentForm = false;
            this.isProgressVisibleComment = false;
            this.errorMessageComment = 'Something went wrong, try again.'
            console.log(error);
        }

    }

    onDeleteComment(commentid:any) {
        this.commentId = commentid;
        this.deleteCommentModal = true;
    }

    async deleteComment() {
        try {
            this.deleteCommentModal = false;
            this.fadeComment = true;
            this.isProgressVisibleDeleteComment = true;
            await this.dbservice.deleteComment(this.id, this.commentId);
            setTimeout(() => {
                this.toast.show('Comment Deleted', {
                    icon: '🗑️',
                    style: {
                    border: '2px solid #dff5ff',
                    padding: '16px',
                    color: 'black',
                    }
                });
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['./'], {
                    relativeTo: this.route,
                    queryParamsHandling: 'merge' // keep params on reload
                });
            }, 1000)
        } catch (error) {
            this.deleteCommentModal = false;
            this.fadeComment = false;
            this.isProgressVisibleDeleteComment = false;
            this.errorMessageDeleteComment = 'Something went wrong, try again.'
            console.log(error);
        }
    }

    async onUpdate() {
        try {
            this.fadeEditForm = true;
            this.isProgressVisibleUpdate = true;
            let currentDateTime = this.datepipe.transform((new Date), 'short');
            this.currentDateEdit = currentDateTime;
            this.editForm.get('date')?.setValue(this.currentDateEdit);
            await this.db.object("/posts/"+this.id).update({
                isEdited: this.editForm.controls["isEdited"].value,
                date: this.editForm.controls["date"].value,
                author: this.editForm.controls["author"].value,
                color: this.editForm.controls["color"].value,
                title: this.editForm.controls["title"].value,
                message: this.editForm.controls["message"].value
            })
            setTimeout(() => {
                this.toast.success("Post updated successfully", {
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
    onDeletePost() {
        this.deletePostModal = true;
    }

    // removes the modal
    removeModal() {
        this.deletePostModal = false;
        this.deleteCommentModal = false;
    }

    // function that does the actual deletion of a post
    async deletePost() {
        try{
            this.deletePostModal = false;
            this.fadePost = true;
            this.isProgressVisibleDelete = true;
            await this.dbservice.deletePost(this.id);
            setTimeout(() => {
                this.isProgressVisibleDelete = false;
                this.modalSuccess = true;
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
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