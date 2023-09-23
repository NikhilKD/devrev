import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
}
