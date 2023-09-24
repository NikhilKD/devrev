import { Component, OnInit} from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit{

  constructor(private ds: DashboardService){}

  bookData: any = []

  show = 15

  showBookData: any = []

  

  ngOnInit(): void {
    this.ds.getBook().then((res)=>{
      res.forEach((doc) => {
          let obj = {
            id : doc.id,
            data: doc.data()
          }
          this.bookData.push(obj);
      });
      for(let i = 0; i < this.show; i++){
        this.showBookData.push(this.bookData[i]);
      }
    })

    fromEvent(document, "scroll").subscribe((event) => {
      let pos = document.documentElement.scrollTop + window.innerHeight;
      let max = document.documentElement.scrollHeight - 5;
      if (pos >= max) {
        if(this.show + 5 < this.bookData.length){
          for(let i = this.show; i < this.show + 5; i++){
            this.showBookData.push(this.bookData[i]);
          }
          this.show = this.show + 5;
        }else{
          for(let i = this.show; i < this.bookData.length; i++){
            this.showBookData.push(this.bookData[i]);
          }
          this.show = this.bookData.length;
        }
        
      }
    })
    
  }

}
