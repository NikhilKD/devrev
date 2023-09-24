import { Injectable, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, increment, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  private active = new Subject<string>();

  activeData(data: string) {
    this.active.next(data);
  }

  getData() {
    return this.active.asObservable();
  }
  

  private username = new Subject<string>();

  changeUser(data: string){
    this.username.next(data);
  }

  getUsername(){
    return this.username.asObservable();
  }


  

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  async getBook() {
    const querySnapshot = await getDocs(collection(this.db, "books"));
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
    return querySnapshot
  }

  async sortBook(name:string){
    const bookRef = collection(this.db, "books");
    const q = query(bookRef, orderBy(name));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  async getIndividualBook(name:string) {
    const docRef = doc(this.db, "books", name);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }

  async getDate(date:any) {
    const bookRef = collection(this.db, "books");
    const q = query(bookRef, where("date","==",date));
    const querySnapshot = await getDocs(q);
    return querySnapshot
  }

  
  
  async getAuthor(name:string) {
    const bookRef = collection(this.db, "books");
    const q = query(bookRef, where("author","==",name));
    const querySnapshot = await getDocs(q);
    return querySnapshot
  }

  async getSubject(subject:string) {
    const bookRef = collection(this.db, "books");
    const q = query(bookRef, where("subject","==",subject));
    const querySnapshot = await getDocs(q);
    return querySnapshot
  }
  
  async addcart(name:string,book:string){
    const temp = doc(this.db, "users", name);
    if((await getDoc(temp)).data()===undefined){
        await setDoc(temp,{
          books: [book]
        }) 
    }else{
      await updateDoc(temp, {
        books: arrayUnion(book)
      });
    }
  }

  async removecart(name:string,book:string){
    const temp = doc(this.db, "users", name);
    await updateDoc(temp, {
      books: arrayRemove(book)
    });

  }

  async getcartitems(name:string) {
    const docRef = doc(this.db, "users", name);
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.['books'];
  }

  async getissueditems(name:string) {
    const docRef = doc(this.db, "users", name);
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.['issue'];
  }


  async issue(name:string){
    const temp = doc(this.db, "users", name);
    const docSnap = await getDoc(temp);
    let issuedbooks:any = [];
    let x=docSnap.data()?.['books'];
    for(let i=0;i<x.length;i++){
      issuedbooks.push(x[i]);
    }
    await updateDoc(temp, {
      books: [],
      issue:issuedbooks
    });
    for(let i=0;i<issuedbooks.length;i++){
      const temp1 = doc(this.db, "books", issuedbooks[i]);
      await updateDoc(temp1, {
        copies: increment(-1)
      });
      const docSnap = await getDoc(temp1);
      let count=docSnap.data()?.['copies'];
      if(count<=0){
        await updateDoc(temp1, {
          status:false
        });
      }
    }
  }

  async returnbook(name:string,book:string){
    const temp = doc(this.db, "users", name);
    await updateDoc(temp, {
      issue: arrayRemove(book)
    });
    const temp1 = doc(this.db, "books", book);
    await updateDoc(temp1, {
      copies: increment(1)
    });
    const docSnap = await getDoc(temp1);
    let count=docSnap.data()?.['copies'];
    if(count>0){
      await updateDoc(temp1, {
        status:true
      });
    }
  }
}
