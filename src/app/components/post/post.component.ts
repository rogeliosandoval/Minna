import { Component, OnDestroy, OnInit} from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { AuthService } from "src/app/services/auth.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IComment } from "src/app/models/IComment";

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
    postSubscription!: Subscription;
    modifyPost = false;
    fadeEditForm = false;
    fadeCommentForm = false;
    fadePost = false;
    fadeComment = false;
    deletePostModal = false;
    deleteCommentModal = false;
    modalSuccess = false;
    showME = false;
    currentUserComments: IComment[] = [];
    commentId: any;

    // colors for the post
    bgBluePost = false;
    bgGreenPost = false;
    bgYellowPost = false;
    bgBrownPost = false;
    bgPurplePost = false;
    bgPinkPost = false;

    // colors for the comment
    bgDefault = false;
    bgTan = false;
    bgRed = false;
    bgSkyBlue = false;
    bgPink = false;

    constructor(private route: ActivatedRoute, private router: Router, private dbservice: DatabaseService, public fireAuth: AngularFireAuth, private afs: AngularFirestore, private db: AngularFireDatabase, private afAuth: AuthService, private modalService: NgbModal){
        this.user = fireAuth.user;
        this.isProgressVisibleUpdate = false;
        this.isProgressVisibleDelete = false;
        this.isProgressVisibleComment = false;
        this.isProgressVisibleDeleteComment = false;

        this.editForm = new FormGroup({
            'author': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required, Validators.maxLength(3000)])
        });

        this.commentForm = new FormGroup({
            'name': new FormControl('', [Validators.required]),
            'email': new FormControl('', [Validators.required]),
            'id': new FormControl('', [Validators.required]),
            'author': new FormControl('', [Validators.required]),
            'color': new FormControl('', [Validators.required]),
            'message': new FormControl('', [Validators.required])
        })

        this.firebaseErrorMessage = '';

    }
    
    ngOnInit(): void {

        this.fireAuth.authState.subscribe(user => {
            if (user) {
                let emailLower = user.email?.toLowerCase();
                this.user = this.afs.collection('users').doc(emailLower).valueChanges();
                this.name = user.displayName;
                this.email = user.email;
            }
        })
        
        this.postSubscription = this.dbservice.getPostById(this.id).subscribe(data => {
            this.postData = data;
        })

        this.postSubscription = this.dbservice.getComments(this.id).subscribe(data => {
            this.commentData = data;
        })

        setTimeout(() => {
            
            // allows users to edit or delete thir own posts
            if (this.postData.name === this.name) {
                this.modifyPost = true;
            } else {
                this.modifyPost = false;
            }

            this.currentUserComments = this.commentData.map(comment=> {
                comment.canModify = (comment.name === this.name);
                return comment;
            })

            this.changeColor();
            this.editForm.get('author')?.setValue(this.postData.author);
            this.editForm.get('color')?.setValue(this.postData.color);
            this.editForm.get('title')?.setValue(this.postData.title);
            this.editForm.get('message')?.setValue(this.postData.message);
            this.commentForm.get('id')?.setValue(this.id);
            this.commentForm.get('name')?.setValue(this.name);
            this.commentForm.get('email')?.setValue(this.email);
            this.commentForm.get('color')?.setValue('default');

        },600)

    }
    
    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
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
    }

    greenPost() {
        this.editForm.get('color')?.setValue('green');
        this.bgGreenPost = true;
        this.bgBluePost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
    }

    yellowPost() {
        this.editForm.get('color')?.setValue('yellow');
        this.bgYellowPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
    }

    brownPost() {
        this.editForm.get('color')?.setValue('brown');
        this.bgBrownPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgPurplePost = false;
        this.bgPinkPost = false;
    }

    purplePost() {
        this.editForm.get('color')?.setValue('purple');
        this.bgPurplePost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPinkPost = false;
    }

    pinkPost() {
        this.editForm.get('color')?.setValue('pink');
        this.bgPinkPost = true;
        this.bgBluePost = false;
        this.bgGreenPost = false;
        this.bgYellowPost = false;
        this.bgBrownPost = false;
        this.bgPurplePost = false;
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

    onComment() {
        this.fadeCommentForm = true;
        this.isProgressVisibleComment = true;
        const ref = this.db.list("posts/"+this.id+"/comments");
        ref.push(this.commentForm.value);
        setTimeout(() => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['./'], {
                relativeTo: this.route,
                queryParamsHandling: 'merge'  // keep params on reload
            })
        }, 1000)
    }

    onDeleteComment(commentid:any) {
        this.commentId = commentid;
        this.deleteCommentModal = true;
    }

    deleteComment() {
        this.deleteCommentModal = false;
        this.fadeComment = true;
        this.isProgressVisibleDeleteComment = true;
        this.dbservice.deleteComment(this.id,this.commentId);
        setTimeout(() => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['./'], {
                relativeTo: this.route,
                queryParamsHandling: 'merge'  // keep params on reload
            })
        }, 1000)
    }

    onUpdate() {
        this.fadeEditForm = true;
        this.isProgressVisibleUpdate = true;
        this.db.object("/posts/"+this.id).update({
            author: this.editForm.controls["author"].value,
            color: this.editForm.controls["color"].value,
            title: this.editForm.controls["title"].value,
            message: this.editForm.controls["message"].value
        })
        setTimeout(() => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['./'], {
                relativeTo: this.route,
                queryParamsHandling: 'merge'  // keep params on reload
            })
        }, 1000)
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
    deletePost() {
        this.deletePostModal = false;
        this.fadePost = true;
        this.isProgressVisibleDelete = true;
        this.dbservice.deletePost(this.id);
        setTimeout(() => {
            this.isProgressVisibleDelete = false;
            this.modalSuccess = true;
            setTimeout(() => {
                this.router.navigate(['/dashboard']);
            }, 2000)
        }, 1000)
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}