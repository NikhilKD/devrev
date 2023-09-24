import {
  Component,
  Inject,
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
import {
  Auth,
  onAuthStateChanged
} from '@angular/fire/auth';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  constructor(private ds: DashboardService, public fb: FormBuilder, @Inject(Auth) private auth: Auth) {}

  bookData: any = []

  username: any

  booksFound = 0

  show = 15

  showBookData: any = []

  sortstates = [{
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


  authorfilter = this.fb.group({
    author: ['']
  })

  genrefilter = this.fb.group({
    genre: ['']
  })

  yearfilter = this.fb.group({
    year: ['']
  })

  addtocart(bookid: string, copies: any) {
    if (copies > 0) {
      console.log(this.username)
      this.ds.addcart(this.username, bookid).then((response) => {
        alert("Book Added to Cart");
      })
    }else{
      alert("Book Unavailable")
    }
  }

  ngOnInit(): void {

    onAuthStateChanged(this.auth, (user) => {
      this.username = user?.email
    });


    this.yearfilter.get('year')?.valueChanges.subscribe((res) => {
      if (res == '') {
        this.showBookData = []
        for (let i = 0; i < this.show; i++) {
          this.showBookData.push(this.bookData[i]);
        }
        this.booksFound = this.bookData.length
      } else {
        this.ds.getDate(res).then((response) => {

          this.showBookData = []
          response.forEach((doc) => {
            let obj = {
              id: doc.id,
              data: doc.data()
            }
            this.showBookData.push(obj);
          });
          this.booksFound = this.showBookData.length
        })
      }

    })

    this.genrefilter.get('genre')?.valueChanges.subscribe((res) => {
      if (res == '') {
        this.showBookData = []
        for (let i = 0; i < this.show; i++) {
          this.showBookData.push(this.bookData[i]);
        }
        this.booksFound = this.bookData.length
      } else {
        this.ds.getSubject(String(res)).then((response) => {
          this.showBookData = []
          response.forEach((doc) => {
            let obj = {
              id: doc.id,
              data: doc.data()
            }
            this.showBookData.push(obj);
          });
          this.booksFound = this.showBookData.length
        })
        this.show = this.bookData.length
      }
    })

    this.authorfilter.get('author')?.valueChanges.subscribe((res) => {
      if (res == '') {
        this.showBookData = []
        for (let i = 0; i < this.show; i++) {
          this.showBookData.push(this.bookData[i]);
        }
        this.booksFound = this.bookData.length
      } else {
        this.ds.getAuthor(String(res)).then((response) => {
          this.showBookData = []
          response.forEach((doc) => {
            let obj = {
              id: doc.id,
              data: doc.data()
            }
            this.showBookData.push(obj);
          });
          this.booksFound = this.showBookData.length
        })

      }
    })

    this.namefilter.get('name')?.valueChanges.subscribe((res) => {
      if (res == '') {
        this.showBookData = []
        for (let i = 0; i < this.show; i++) {
          this.showBookData.push(this.bookData[i]);
        }
        this.booksFound = this.bookData.length
      } else {
        this.ds.getIndividualBook(String(res)).then((response) => {
          this.showBookData = []
          let obj = {
            id: response.id,
            data: response.data()
          }
          this.showBookData.push(obj)
          this.booksFound = this.showBookData.length
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
        this.booksFound = this.bookData.length
      });
      for (let i = 0; i < this.show; i++) {
        this.showBookData.push(this.bookData[i]);
      }
    })

    this.sort.get('sortby')?.valueChanges.subscribe((res) => {
      console.log(res);

      if (res == '') {
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
      } else {
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
            for (let i = 0; i < this.show; i++) {
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

  

  // Search Bar
  Search = this.fb.group({
    searchInput: ['']
  })


  searchedArray: any= []


  searchParms(){
    let searchValue = this.Search.value.searchInput
    for(let i = 0; i < this.bookData.length; i++){
      if(searchValue?.toLowerCase() == this.bookData.id.toLowerCase()){

      }
    }
  }




}
