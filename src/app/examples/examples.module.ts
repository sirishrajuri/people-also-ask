import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { AgmCoreModule } from '@agm/core';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ExamplesComponent } from './examples.component';
import { RegisterComponent } from './register/register.component';
import {RouterModule} from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { AlertComponent } from 'app/_components';
import { SafePipe } from 'app/safe.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NouisliderModule,
        JwBootstrapSwitchNg2Module,
        ReactiveFormsModule,
        RouterModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_KEY_HERE'
        })
    ],
    declarations: [
        LoginComponent,
        ExamplesComponent,
        ProfileComponent,
        RegisterComponent,
        ArticlesComponent,
        AlertComponent,
        SafePipe
    ]
})
export class ExamplesModule { }
