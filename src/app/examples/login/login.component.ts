import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from 'app/_services';
import { IAlert } from 'app/components/notification/notification.component';
import { NavbarComponent } from 'app/shared/navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    data : Date = new Date();
    focus;
    focus1;

    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    static alerts: Array<IAlert> = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.returnUrl = '/';
    }
    ngOnDestroy(){
    }

    get f() { return this.form.controls; }

    public closeAlert(alert: IAlert) {
        const index: number = LoginComponent.alerts.indexOf(alert);
        LoginComponent.alerts.splice(index, 1);
    }

    get alertsView(){
        return LoginComponent.alerts;
    }

    onSubmit() {
        this.submitted = true;
        LoginComponent.alerts.length=0;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        
        this.loading = true;
        this.accountService.login(this.f['username'].value, this.f['password'].value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/index']);
                    NavbarComponent.isLoggedIn=true;
                },
                error => {
                    LoginComponent.alerts.push({
                        id: 1,
                        type: 'danger',
                        strong: '',
                        message: error,
                        icon: 'objects_support-17'
                    });
                    this.loading = false;
                });
            }

}
