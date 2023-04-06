import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService,AlertService } from 'app/_services';
import { User } from 'app/_models';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'app/env';
import { SafeUrl } from '@angular/platform-browser';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  data : Date = new Date();
  focus;
  focus1;
  user: User;
  resultKeywords: any[] = [];
  contentRendered:string='';
  menuItems: any[];
  audioUrl: SafeUrl;
  videoSource = '';
  resultArticle:string;
  form: FormGroup;
  loading:boolean;
  loadingArticle:boolean;
  submitted = false;
  url = window.URL;
  returnUrl:any;
  articleAudioGenerated:boolean=false;
  isLoadingArticle:boolean=false;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private httpClient: HttpClient
) {
  this.user = this.accountService.userValue;
}

  ngOnInit() {
    var rellaxHeader = new Rellax('.rellax-header');


    // var body = document.getElementsByTagName('body')[0];
    // body.classList.add('landing-page');
    // var navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.add('navbar-transparent');


    this.httpClient.get(`${API_URL}/articles/`+this.user.username)
      .subscribe((data:any) => {
          this.resultKeywords = data;
          console.log(data);
      });
    
  }


  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  articleSelected(query){
    for (let index = 0; index < this.resultKeywords.length; index++) {
      const element = this.resultKeywords[index];
      if(element.query==query){
        this.contentRendered=element.article;
        console.log(element.query);
        if(this.contentRendered != 'article generation in progress.' && element['video generated']){
          this.articleAudioGenerated=true;
          this.generateVideo(element['time of request']);
        }
        else{
          this.articleAudioGenerated=false;
        }
      }
    }

  }

  generateVideo(tof) {
    var formDatas: any = new FormData();
    formDatas.append('tof', tof);
    formDatas.append('username', this.user.username);
    this.videoSource = '';
    this.httpClient.post(`${API_URL}/generate_video`, formDatas,{ responseType: 'blob' })
    .subscribe((data:any) => {
        this.videoSource = URL.createObjectURL(data);
    });
}



}
