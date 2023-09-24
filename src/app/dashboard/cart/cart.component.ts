import { Component, Inject, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  username: any;
  constructor(private ds: DashboardService, @Inject(Auth) private auth: Auth){}
  cartBooks: any = []

  ngOnInit(): void {

    onAuthStateChanged(this.auth, (user) => {
      this.username = user?.email
      this.ds.getcartitems(this.username).then((response)=>{
        for(let i = 0; i < response.length; i++){
          this.ds.getIndividualBook(response[i]).then((result)=>{
            this.cartBooks.push(result.data());
          })
        }
      })
    });
  }

  removefromcart(bookid: any){
    this.ds.removecart(this.username,bookid).then((res)=>{
      this.cartBooks = []
      this.ds.getcartitems(this.username).then((response)=>{
        for(let i = 0; i < response.length; i++){
          this.ds.getIndividualBook(response[i]).then((result)=>{
            this.cartBooks.push(result.data());
          })
        }
        console.log(this.cartBooks);
      })
    })
    
  }


}
