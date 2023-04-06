import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './components/components.component';
import { LoginComponent } from './examples/login/login.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { AuthGuard } from './_helpers';
import { RegisterComponent } from './examples/register/register.component';
import { ArticlesComponent } from './examples/articles/articles.component';
import { AddTokenBalanceComponent } from './users/addTokenBalance.component';
import { AllComponent } from './components/allUsers/all.component';


// const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
// const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index',                component: ComponentsComponent},
    { path: 'login',                component: LoginComponent },
    { path: 'profile',     component: ProfileComponent,canActivate: [AuthGuard] },
    { path: 'register',     component: RegisterComponent },
    { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
    { path: 'addBalance', component: AddTokenBalanceComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AllComponent, canActivate: [AuthGuard] },
      
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
