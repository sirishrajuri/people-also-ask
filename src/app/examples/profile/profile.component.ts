import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService,AlertService } from 'app/_services';
import { User } from 'app/_models';
import { IAlert } from 'app/components/notification/notification.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  zoom: number = 14;
  lat: number = 44.445248;
  lng: number = 26.099672;
  styles: any[] = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
    data : Date = new Date();
    focus;
    focus1;
    form: FormGroup;
    id: string;
    loading = false;
    submitted = false;
    user: User;
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
      var rellaxHeader = new Rellax('.rellax-header');
      this.id = this.user.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        passwordValidators.push(Validators.required);

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', passwordValidators],
            tokenBalance:[]
        });

        this.accountService.getById(this.id)
        .pipe(first())
                .subscribe(x => {
                    this.f['firstName'].setValue(x.firstName);
                    this.f['lastName'].setValue(x.lastName);
                    this.f['username'].setValue(x.username);
                    this.f['tokenBalance'].setValue(x.tokenBalance);
                });
        console.log(this.user.password);
    }
    ngOnDestroy(){
    }

    get f() { return this.form.controls; }

    public closeAlert(alert: IAlert) {
      const index: number = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
    }

    onSubmit() {
        this.submitted = true;
        this.alerts.length=0;
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.updateUser();
      }
      private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                  this.loading = false;
                  this.alerts.push({
                    id: 2,
                    type: 'success',
                    strong: '',
                    message: 'Profile updated successfully',
                    icon: 'ui-2_like'
                });
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
