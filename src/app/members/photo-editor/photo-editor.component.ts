import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChanged = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  response: string;
  baseUrl = environment.apiUrl;
  currentMainPhoto : Photo;

  constructor(private authService: AuthService, 
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/" + this.authService.decodedToken.nameid + "/photos",
      authToken: "Bearer " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false };

    this.uploader.onSuccessItem = (item,res, status,header) =>{
      if(res){
        const resp: Photo = JSON.parse(res);
        const photo ={
            id: resp.id,
            dateAdded: resp.dateAdded,
            description:resp.description,
            isMain:resp.isMain,
            url:resp.url,
        };
        this.photos.push(photo);
        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
        }



      }
    }

  }

  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authService.decodedToken.nameid,photo.id).subscribe(()=> {
      this.currentMainPhoto = this.photos.filter(p=> p.isMain === true)[0];
      this.currentMainPhoto.isMain = false;
      photo.isMain = true;
     // this.getMemberPhotoChanged.emit(photo.url);
     this.authService.changeMemberPhoto(photo.url);
     
     this.authService.currentUser.photoUrl = photo.url;
     localStorage.setItem("user",JSON.stringify( this.authService.currentUser));
      this.alertify.success("Photo set to main successfully.");
    }, error => {
      this.alertify.error(error);
    });
  }

  deletePhoto(id: number){
    this.userService.deletePhoto(this.authService.decodedToken.nameid,id).subscribe(()=>{
      this.photos.splice(this.photos.findIndex(p => p.id === id),1);
      this.alertify.success("Photo deleted successfully");
    }, error => {
      this.alertify.error(error)
    });
  }

}
