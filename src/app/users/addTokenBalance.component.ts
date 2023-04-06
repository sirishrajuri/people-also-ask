import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService,AlertService } from '../_services';
import { User } from '../_models';
import { IAlert } from 'app/components/notification/notification.component';
import { ComponentsComponent } from 'app/components/components.component';

//import { AccountService, AlertService } from './_services';

@Component({ templateUrl: 'addTokenBalance.component.html', styleUrls: ['./addTokenBalance.component.css']})
export class AddTokenBalanceComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    user:User;
    public alerts: Array<IAlert> = [];
    
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.accountService.getById(this.user.id)
        .pipe(first())
                .subscribe(x => {
                    this.user.tokenBalance = x.tokenBalance;
                });
    }

    UpdateBalance(tokenBal){
        this.accountService.getById(this.user.id)
        .pipe(first())
                .subscribe(x => {
                    this.user.tokenBalance = x.tokenBalance;
                });
        if(!this.user.tokenBalance){
            this.user.tokenBalance=0;
        }
        var tb= parseInt(tokenBal);
        if(tb<0){
                this.alerts.push({
                id: 2,
                type: 'danger',
                strong: '',
                message: 'Token balance added cannot be negative',
                icon: 'objects_support-17'
            });
            return
        }
        
        this.user.tokenBalance+=tb;
        this.updateUser();
    }

    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    updateUser() {
        this.accountService.update(this.user.id, this.user)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/index']);
                });
                ComponentsComponent.alerts.push({
                    id: 1,
                    type: 'success',
                    strong: '',
                    message: 'Token Balance added successfully',
                    icon: 'ui-2_like'
                });
    }

    
}