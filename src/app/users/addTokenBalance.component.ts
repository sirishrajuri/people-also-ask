import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService,AlertService } from '../_services';
import { User } from '../_models';

//import { AccountService, AlertService } from './_services';

@Component({ templateUrl: 'addTokenBalance.component.html', styleUrls: ['./addTokenBalance.component.css']})
export class AddTokenBalanceComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    user:User;
    
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
            console.log("eeror token bal");
            this.user.tokenBalance=0;
        }
        console.log("before"+this.user.tokenBalance);
        var tb= parseInt(tokenBal);
        this.user.tokenBalance+=tb;
        console.log("after"+this.user.tokenBalance);
        this.alertService.success('Token Balance added successfully');
        this.updateUser();
    }

    updateUser() {
        this.accountService.update(this.user.id, this.user)
            .pipe(first())
            .subscribe(
                data => {});
    }

    
}