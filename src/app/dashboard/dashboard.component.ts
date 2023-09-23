import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{



  constructor(private router: Router, private cds: DashboardService){
  }
  ngOnInit(): void {
    
  }

  routeChange(){
    this.cds.activeData(String(this.router.url))
  }
}
