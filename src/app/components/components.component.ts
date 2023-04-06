import { Component, OnInit, Renderer2, OnDestroy,Input } from '@angular/core';
import { NgbDateStruct, NgbModal,NgbAccordionConfig,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Rellax from 'rellax';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL, API_URL_COLLAB } from '../env';
import { User } from '../_models';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService,AlertService } from '../_services';
import { SafeUrl } from '@angular/platform-browser';
import { DomSanitizer} from '@angular/platform-browser';
import { IAlert } from './notification/notification.component';
import { LoginComponent } from 'app/examples/login/login.component';

@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: [`
    ngb-progressbar {
        margin-top: 5rem;
    }
    `]
})

export class ComponentsComponent implements OnInit, OnDestroy {

    user: User;
    resultKeywords: any[] = [];
    resultArticle:string;
    form: FormGroup;
    loading:boolean;
    loadingArticle:boolean;
    submitted = false;
    url = window.URL;
    returnUrl:any;
    audioUrl: SafeUrl;
    isPaused = false;
    smapleURL:string;
    articleAudioGenerated:boolean=false;
    audioSource = '';
    videoSource = '';
    isLoadingArticle:boolean=false;
    data : Date = new Date();

    page = 4;
    page1 = 5;
    page2 = 3;
    focus;
    focus1;
    focus2;
    closeResult: string;

    static alerts: Array<IAlert> = [];

    get alertView(){
        return ComponentsComponent.alerts;
    }

    date: {year: number, month: number};
    model: NgbDateStruct;

    public isCollapsed = true;
    public isCollapsed1 = true;
    public isCollapsed2 = true;

    state_icon_primary = true;

    constructor(private router: Router,private modalService: NgbModal,private renderer : Renderer2, config: NgbAccordionConfig,private sanitizer: DomSanitizer,private formBuilder: FormBuilder,private accountService: AccountService,private httpClient: HttpClient,private alertService: AlertService) {
        this.user = this.accountService.userValue;
        config.closeOthers = true;
        config.type = 'info';
        // this.alerts.push({
        //     id: 1,
        //     type: 'success',
        //     strong: 'Well done!',
        //     message: 'You successfully read this important alert message.',
        //     icon: 'ui-2_like'
        // });
    }
    isWeekend(date: NgbDateStruct) {
        const d = new Date(date.year, date.month - 1, date.day);
        return d.getDay() === 0 || d.getDay() === 6;
    }

    isDisabled(date: NgbDateStruct, current: {month: number}) {
        return date.month !== current.month;
    }

    ngOnInit() {
      var rellaxHeader = new Rellax('.rellax-header');        
        this.form = this.formBuilder.group({
            keywords: ['', Validators.required],
            number: ['', Validators.required]
        });
        this.updateTokenBalance();
    }
    ngOnDestroy(){
       
    }

    public closeAlert(alert: IAlert) {
        const index: number = ComponentsComponent.alerts.indexOf(alert);
        ComponentsComponent.alerts.splice(index, 1);
    }

    get f() { return this.form.controls; }

    onSubmit() {
        if(this.user.id === undefined){
            this.router.navigate(['/login']);
            LoginComponent.alerts.push({
                id: 1,
                type: 'danger',
                strong: '',
                message: 'Please login to continue searching',
                icon: 'objects_support-17'
            });
            return;
        }

        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.resultArticle='';
        this.resultKeywords=[];
        this.loading=true;
        this.articleAudioGenerated=false;
        var formData: any = new FormData();
        formData.append('keywords', this.form.value.keywords);
        formData.append('number', this.form.value.number);
        this.httpClient.post(`${API_URL}/related_articles`, formData)
              .subscribe((data:any) => {
                console.log(data);
                this.loading=false;
                this.resultKeywords=data;
            });
    }

    generateSimpleArticle(name:string) {
        this.loadingArticle=true;
        var formData: any = new FormData();
        formData.append('query', name);
        this.httpClient.post(`${API_URL}/generate_simple_article`, formData)
        .subscribe((data:any) => {
            this.loadingArticle=false;
            this.resultArticle=data;
            this.user.tokenBalance--;
            this.updateUser();
            this.alertService.success('Token Balance has been reduced by 1', { keepAfterRouteChange: true });
        });
    }

    generateLongArticle(name:string) {
        this.loadingArticle=true;
        var formData: any = new FormData();
        formData.append('query', name);
        formData.append('username', 'admin');
        this.httpClient.post(`${API_URL}/generate_article`, formData)
        .subscribe((data:any) => {
            // this.loadingArticle=false;
            // this.resultArticle=data;
            // this.user.tokenBalance--;
            // this.updateUser();
            // this.alertService.success('Token Balance has been reduced by 1', { keepAfterRouteChange: true });
        });
    }

    getArticle(){
        this.httpClient.get(`${API_URL}/articles/admin`)
        .subscribe((data:any) => {
            console.log(data);
        });
    }

    generateAudio() {
        this.articleAudioGenerated=false;
        this.isLoadingArticle=true;
        var formDatas: any = new FormData();
        formDatas.append('text', this.resultArticle);
        this.httpClient.post(`http://9b09-34-143-147-76.ngrok.io/generate_video`, formDatas,{ responseType: 'blob' })
        .subscribe((data:any) => {
            this.audioSource=URL.createObjectURL(data);
            this.articleAudioGenerated=true;
            this.isLoadingArticle=false;
        });
    }

    updateTokenBalance(){
        if(this.user.id !== undefined){
        this.accountService.getById(this.user.id)
        .pipe(first())
                .subscribe(x => {
                    this.user.tokenBalance = x.tokenBalance;
                });
            }
    }

    updateUser() {
        this.accountService.update(this.user.id, this.user)
            .pipe(first())
            .subscribe(
                data => {});
    }

    generateVideo() {
        this.articleAudioGenerated=false;
        this.isLoadingArticle=true;
        var formDatas: any = new FormData();
        formDatas.append('text', this.resultArticle);
        this.httpClient.post(`${API_URL}/generate_video`, formDatas,{ responseType: 'blob' })
        .subscribe((data:any) => {
            this.videoSource = URL.createObjectURL(data);
            this.articleAudioGenerated=true;
            this.isLoadingArticle=false;
        });
    }

    generate(name:string) {
        var k:number = this.user.tokenBalance;
        if(k<5){
            ComponentsComponent.alerts.push({
                id: 1,
                type: 'danger',
                strong: '',
                message: 'Minimum token balance of 5 is needede to generate article,audio and video',
                icon: 'objects_support-17'
            });
            return;
        }
        ComponentsComponent.alerts.length=0;
        
        this.loadingArticle=true;
        var formData: any = new FormData();
        formData.append('query', name);
        formData.append('username', this.user.username);
        var tb= parseInt("5");
        this.user.tokenBalance-=tb;
        this.updateUser();
        this.updateTokenBalance();
        this.httpClient.post(`${API_URL}/generate_article`, formData)
        .subscribe((data:any) => {});
        this.router.navigate(['/articles']);
    }

    open(content, type, modalDimension) {
        if (modalDimension === 'sm' && type === 'modal_mini') {
            this.modalService.open(content, { windowClass: 'modal-mini modal-primary', size: 'sm' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        } else if (modalDimension == undefined && type === 'Login') {
          this.modalService.open(content, { windowClass: 'modal-login modal-primary' }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        } else {
            this.modalService.open(content).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }

    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

}
