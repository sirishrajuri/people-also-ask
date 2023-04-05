import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { User } from 'app/_models';
import { AccountService } from 'app/_services';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    [x: string]: any;
    user: User | undefined;
    static isLoggedIn:boolean=false;

    constructor(public location: Location, private element : ElementRef,private accountService: AccountService) {
        this.sidebarVisible = false;
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit() {
        if(this.user.id === undefined){
            NavbarComponent.isLoggedIn=false;
        }
        else{
            NavbarComponent.isLoggedIn=true;
        }
    }

    get isLoggedInView(){
        return NavbarComponent.isLoggedIn;
    }

    logout() {
        this.accountService.logout();
        NavbarComponent.isLoggedIn=false;
    }
}
