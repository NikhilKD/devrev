import { Injectable, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, increment, orderBy, query, updateDoc } from "firebase/firestore";
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

  async sortBook() {
    const docRef = collection(this.db, "books");
    const q = query(docRef, orderBy("price"))
    console.log(q)
  }

  
  
  async addcart(name:string,book:string){
    const temp1 = doc(this.db, "books", book);
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
    const temp = doc(this.db, "users", name);
    await updateDoc(temp, {
      books: arrayUnion(book)
    });

  }

  async removecart(name:string,book:string){
    const temp = doc(this.db, "users", name);
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
    await updateDoc(temp, {
      books: arrayRemove(book)
    });

  }

  async getcartitems(name:string) {
    const docRef = doc(this.db, "users", name);
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.['books'];
  }

}
