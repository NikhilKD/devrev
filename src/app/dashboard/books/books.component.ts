import {
  Component,
  OnInit
} from '@angular/core';
import {
  DashboardService
} from '../dashboard.service';
import {
  fromEvent
} from 'rxjs';
import {
  FormBuilder
} from '@angular/forms';
import {
  FormControl,
  FormGroup
} from '@angular/forms';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  constructor(private ds: DashboardService, public fb: FormBuilder) {}

  bookData: any = []

  show = 15

  showBookData: any = []

  sortstates = [
    {
      name: 'Name',
      value: 'name'
    },
    {
      name: 'Author',
      value: 'author'
    },
    {
      name: 'Subject',
      value: 'subject'
    },
    {
      name: 'Date',
      value: 'date'
    },
  ];

  sort = this.fb.group({
    sortby: ['']
  })


  namefilter = this.fb.group({
    name: ['']
  })



  ngOnInit(): void {

    this.namefilter.get('name')?.valueChanges.subscribe((res)=>{
      if(res == ''){
        this.showBookData = []
        for (let i = 0; i < this.show; i++) {
          this.showBookData.push(this.bookData[i]);
        }
      }else{
        this.ds.getIndividualBook(String(res)).then((response)=>{
          this.showBookData = []
          let obj = {
            id: response.id,
            data: response.data()
          }
          this.showBookData.push(obj)
        })
      }
      
    })

    this.ds.getBook().then((res) => {
      res.forEach((doc) => {
        let obj = {
          id: doc.id,
          data: doc.data()
        }
        this.bookData.push(obj);
      });
      for (let i = 0; i < this.show; i++) {
        this.showBookData.push(this.bookData[i]);
      }
    })

    this.sort.get('sortby')?.valueChanges.subscribe((res) => {
      console.log(res);
      
      if(res == ''){
        this.ds.getBook().then((res) => {
          this.showBookData = []
          this.bookData = []
          res.forEach((doc) => {
            let obj = {
              id: doc.id,
              data: doc.data()
            }
            this.bookData.push(obj);
          });
          for (let i = 0; i < this.show; i++) {
            this.showBookData.push(this.bookData[i]);
          }
    
        })
      }else{
        this.ds.sortBook(String(res))
        .then((res) => {
          this.showBookData = []
          this.bookData = []
          res.forEach((doc) => {
            let obj = {
              id: doc.id,
              data: doc.data()
            }
            this.bookData.push(obj);
          });
          for(let i = 0; i < this.show;i++){
            this.showBookData.push(this.bookData[i])
          }
        })
      }

      
      
    })

    //Pagination
    fromEvent(document, "scroll").subscribe((event) => {
      let pos = document.documentElement.scrollTop + window.innerHeight;
      let max = document.documentElement.scrollHeight - 5;
      if (pos >= max) {
        if (this.show + 5 < this.bookData.length) {
          for (let i = this.show; i < this.show + 5; i++) {
            this.showBookData.push(this.bookData[i]);
          }
          this.show = this.show + 5;
        } else {
          for (let i = this.show; i < this.bookData.length; i++) {
            this.showBookData.push(this.bookData[i]);
          }
          this.show = this.bookData.length;
        }

      }
    })

  }



}
