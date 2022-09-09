import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from './transform.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//Pages
import { AppComponent } from './app.component';
import { Home } from './components/home/home.component';
import { Login } from './components/login/login.component';
import { Signup } from './components/signup/signup.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { Post } from './components/post/post.component';
import { CreatePost } from './components/create-post/create-post.component';
import { Profile } from './components/profile/profile.component';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard.component';
import { ForgotPassword } from './components/forgot-password/forgot-password.component';
import { VerifyEmail } from './components/verify-email/verify-email.component';
import { Logout } from './components/logout/logout.component';

//Services
import { AuthGuard } from './services/auth.guard';
import { AuthAdminGuard } from './services/auth-admin.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';

//Material Design
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

//Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login, data: { animation: 'fader' } },
  { path: 'signup', component: Signup, data: { animation: 'fader' } },
  { path: 'dashboard', component: Dashboard, data: { animation: 'fader' }, canActivate: [AuthGuard] },
  { path: 'posts', component: Dashboard, data: { animation: 'fader' }, canActivate: [AuthGuard] },
  { path: 'posts/:id', component: Post, data: { animation: 'fader' }, canActivate: [AuthGuard] },
  { path: 'create-post', component: CreatePost, data: { animation: 'fader' }, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, data: { animation: 'fader' }, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboard, data: { animation: 'fader' } , canActivate: [AuthAdminGuard] },
  { path: 'forgot-password', component: ForgotPassword, data: { animation: 'fader' } },
  { path: 'verify-email', component: VerifyEmail, data: { animation: 'fader' } },
  { path: 'logout', component: Logout, data: { animation: 'fader' } },
  { path: '**', component: Home }
]

@NgModule({
  declarations: [
    AppComponent,
    Home,
    Login,
    Signup,
    Dashboard,
    Post,
    CreatePost,
    Profile,
    AdminDashboard,
    ForgotPassword,
    VerifyEmail,
    Logout,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    Ng2SearchPipeModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
