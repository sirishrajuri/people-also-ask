import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from 'app/_services/account.service';
import { AlertService } from 'app/_services';
import { IAlert } from 'app/components/notification/notification.component';
import { LoginComponent } from '../login/login.component';

// import { AccountService, AlertService } from '.../_services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    data : Date = new Date();
    focus;
    focus1;
    form: FormGroup;
    loading = false;
    submitted = false;

    public alerts: Array<IAlert> = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    // ngOnInit() {
    //     var body = document.getElementsByTagName('body')[0];
    //     body.classList.add('login-page');

    //     var navbar = document.getElementsByTagName('nav')[0];
    //     navbar.classList.add('navbar-transparent');
    // }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            tokenBalance:[]
        });
    }


    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    get f() { return this.form.controls; }

    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    onSubmit() {
        this.submitted = true;

        this.alerts.length = 0;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    LoginComponent.alerts.push({
                        id: 1,
                        type: 'success',
                        strong: '',
                        message: 'Registration Successful',
                        icon: 'ui-2_like'
                    });
                    this.router.navigate(['/login'], { relativeTo: this.route });
                },
                error => {
                    this.alerts.push({
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
