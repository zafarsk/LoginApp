import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild("memberTabs",{static:true}) memberTabs : TabsetComponent
  user: User;
  slideIndex = 1;
  constructor(private userService: UserService, private alertify: AlertifyService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute.data.subscribe(data => {
      this.user = data['user'];
    });  
    //this.showSlides(this.slideIndex);
    this.activateRoute.queryParams.subscribe(data =>{
      const selectedTab = data["tab"];
      this.selectTab(selectedTab > 0? selectedTab : 0);
    })
  }

  getPhotos()
  {
    const photos =[];
    for(const photo of this.user.photos){
      photos.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description

      });
    }

    return photos;
  }

  loadUser() {
    this.userService.getUser(+this.activateRoute.snapshot.params['id']).subscribe((user: User) => {
      this.user = user;

    }, error => {
      this.alertify.error(error);
    });
  }

   
    

    // Next/previous controls
     plusSlides(n) {
      this.showSlides((this.slideIndex += n));
    }

    // Thumbnail image controls
     currentSlide(n) {
      this.showSlides((this.slideIndex = n));
    }

     showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("demo");
      var captionText = document.getElementById("caption");
      if (n > slides.length) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = slides.length;
      }
      for (i = 0; i < slides.length; i++) {
       slides[i].setAttribute("style","display:none");
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }

      if(slides.length > 0){
        slides[this.slideIndex - 1].setAttribute("style","display:block");
      }

     if(dots.length > 0)
     {
      dots[this.slideIndex - 1].className += " active";
      captionText.innerHTML = dots[this.slideIndex - 1].getAttribute("alt");
     }
      //
      //
    }

    selectTab(tabId: number){
      this.memberTabs.tabs[tabId].active = true;
    }


}
