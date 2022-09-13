import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service'
import { DatabaseService } from "src/app/services/database.service";
import { IPost } from "src/app/models/IPost";
import { HotToastService } from '@ngneat/hot-toast';
import { Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class Profile implements OnInit, OnDestroy {

    user: Observable<any>;  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)
    username: any;
    postData: IPost[] = [];
    userData: IPost[] = [];
    postSubscription!: Subscription;
    showPosts = false;
    showAdd = false;
    pageLoading = true;
    p: number = 1;
    currentPage: any;
    searchText = '';
    userAvatar: any;
    changeAvatar = false;

    avatars = [
        {'path':'assets/avatars/penguin.svg'},
        {'path':'assets/avatars/angry-bird.svg'},
        {'path':'assets/avatars/bird.svg'},
        {'path':'assets/avatars/bunny.svg'},
        {'path':'assets/avatars/cow.svg'},
        {'path':'assets/avatars/dog.svg'},
        {'path':'assets/avatars/pig.svg'},
        {'path':'assets/avatars/troll.svg'},
        {'path':'assets/avatars/goth.svg'},
        {'path':'assets/avatars/Female-Avatar-2.svg'},
        {'path':'assets/avatars/Female-Avatar-3.svg'},
        {'path':'assets/avatars/Male-Avatar-2.svg'},
        {'path':'assets/avatars/Male-Avatar-3.svg'},
        {'path':'assets/avatars/Female-Avatar-4.svg'},
        {'path':'assets/avatars/Male-Avatar.svg'},
        {'path':'assets/avatars/Female-Avatar.svg'},
        {'path':'assets/avatars/anime-boy-serious.svg'},
        {'path':'assets/avatars/Anime-Girl-Illustration.svg'},
        {'path':'assets/avatars/anime-girl-one.svg'},
        {'path':'assets/avatars/anime-girl-two.svg'},
        {'path':'assets/avatars/bleed.svg'},
        {'path':'assets/avatars/hehe.svg'},
        {'path':'assets/avatars/cryingboy.svg'},
        {'path':'assets/avatars/green-eye.svg'},
        {'path':'assets/avatars/halloween-cat.svg'},
        {'path':'assets/avatars/halloween_1.svg'},
        {'path':'assets/avatars/greenthing.gif'},
        {'path':'assets/avatars/duck.gif'},
        {'path':'assets/avatars/truck.svg'},
        {'path':'assets/avatars/pencil.svg'},
    ];

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
                    this.userAvatar = user.photoURL;
                    console.log(user);
                }
                
            });
            
            this.postSubscription = this.dbservice.getPosts().subscribe(data => {
                this.postData = data.reverse();
            })
    
            setTimeout(() => {
                this.pageLoading = false;
                this.userData = this.postData.filter(data => data.name === this.username);
                if (this.userData.length === 0){
                    this.showAdd = true;
                } else {
                    this.showPosts = true;
                }
            }, 600);
        } catch (error) {
            console.log(error);
        }

    }

    updateAvatar(path:any) {
        this.changeAvatar = false;
        this.toast.loading("Updating avatar...", {
            duration: 1000, style: {
            border: '2px solid #dff5ff',
            padding: '16px',
            color: 'black',
        }});
        this.afAuth.UpdateProfile(path)
        setTimeout(() => {
            this.toast.success("Avatar updated successfully", {
                style: {
                border: '2px solid #dff5ff',
                padding: '16px',
                color: 'black',
              }});
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['./'], {
                relativeTo: this.route
            })
        }, 1000)
    }

    ngOnDestroy(): void {
        this.postSubscription && this.postSubscription.unsubscribe();
    }

    openModal() {
        this.changeAvatar = true;
    }

    removeModal() {
        this.changeAvatar = false;
    }

    // scrolls user back to the top on pagination change
    onPageChange(page: number) {
        this.currentPage = page;
        window.scrollTo(0,0);
    }

    logout(): void {
        this.afAuth.logoutUser();
    }

}