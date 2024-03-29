import { Component, OnInit } from '@angular/core';
import { PageHeadingService } from '../service/pageHeader.service';
import { HTTPService } from '../service/http.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs:any;
  specificFAQ:any;
  selectedTab:any="user"
  constructor(private pageHeadingService:PageHeadingService,private service:HTTPService){}
  ngOnInit() {
    this.pageHeadingService.setPageTitle({
      display: true,
      heading: "FAQ'S",
      subHeading: 'subtext',
    });

    this.service.httpRequest("/ee-dashboard/api/v1/faq/data",'GET','')
    .subscribe(
      (data:any)=>{
        this.faqs=data[0]
        this.specificFAQ=data[0].userFAQ 
      }
    )
  }
  getFaq(data:string){
    this.selectedTab=data
    switch(data){
      case 'user':
        return this.specificFAQ=this.faqs.userFAQ
      case 'admin' :
        return this.specificFAQ= this.faqs.adminFAQ
      case 'reviewer':
        return this.specificFAQ=this.faqs.reviewerFAQ
      default :
      return ''
    }
  }
  isSelected(data:string){
    return this.selectedTab === data
  }



}
