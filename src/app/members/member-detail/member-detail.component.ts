import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertify: AlertifyService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    //this.loadUser();
    this.activateRoute.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  loadUser() {
    this.userService.getUser(+this.activateRoute.snapshot.params['id']).subscribe((user: User) => {
      this.user = user;

    }, error => {
      this.alertify.error(error);
    });
  }



}
