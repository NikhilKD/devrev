import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  navactivestyle = "flex items-center tracking-wide font-normal text-sm h-12 text-white bg-purple-700 rounded-r-lg my-2 shadow-xl "
  navdeactivestyle = "flex text-gray-700 tracking-wide font-normal text-sm h-12 hover:text-black items-center"
  constructor(private router: Router, private cds: DashboardService){
    
  }
  public navbar = [false, false]
  ngOnInit(): void {
    this.cds.getData().subscribe((res)=>{
      for(let i = 0; i < this.navbar.length; i++){
        this.navbar[i] = false
      }
      if(res == '/dashboard'){
        this.navbar[0] = true
      }else if(res == '/dashboard/books'){
        this.navbar[1] = true
      }
      
    })
  }
}
