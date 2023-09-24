import { Component, Inject, OnInit } from '@angular/core';
import {
  Auth,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  username: any;
  issuedBooks: any = []
  issuedBooksNumber = 0

  author: any = []
  genre: any = []

  authornumbers = 0
  genrenumber = 0
  number = 0
  constructor(private ds: DashboardService, @Inject(Auth) private auth: Auth){}
  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.username = user?.email

      this.ds.getissueditems(this.username).then((res)=>{
        for(let i =0;i < res.length; i++){
          this.ds.getIndividualBook(res[i]).then((response)=>{
            this.issuedBooks.push(response.data());
            this.author.push(response.data()?.['author'])
            this.genre.push(response.data()?.['subject'])
            this.issuedBooksNumber++
          })
        }
        this.authornumbers = this.author.length
        
        this.genrenumber = 2
        // console.log([this.genre]);
        
      })
    });

    this.ds.getBook().then((res)=>{
      res.forEach((doc) => {
        this.number++
      });
      
    })



    
  }
  
  returnbook(bookid: any){

    this.ds.returnbook(this.username,bookid).then((res)=>{
      this.issuedBooks = []
      this.issuedBooksNumber = 0
      this.ds.getissueditems(this.username).then((res)=>{
        for(let i =0;i < res.length; i++){
          this.ds.getIndividualBook(res[i]).then((response)=>{
            this.issuedBooks.push(response.data());
            this.author.push(response.data()?.['author'])
            this.genre.push(response.data()?.['subject'])
            this.issuedBooksNumber++
          })
        }
        
        this.genrenumber = 2
      })
    })

  }

  



}
