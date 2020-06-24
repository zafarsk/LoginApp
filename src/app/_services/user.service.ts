import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

// var httpOptions ={
//   headers: new HttpHeaders({
//     "Authorization":"bearer " + localStorage.getItem("token")
//   })
// };

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

  }

  getUsers(pageNumber?, pageSize?, userParams?, likersParams?): Observable<PaginatedResult<User[]>> {

    const paginationResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let httpParams = new HttpParams();
    if (pageNumber != null && pageSize != null) {
      httpParams = httpParams.append('pageNumber', pageNumber);
      httpParams = httpParams.append('pageSize', pageSize);
    }

    if(userParams != null){
      httpParams = httpParams.append('minAge', userParams.minAge);
      httpParams = httpParams.append('maxAge', userParams.maxAge);
      httpParams = httpParams.append('gender', userParams.gender);
      httpParams = httpParams.append('orderBy', userParams.orderBy);
    }

    if(likersParams === "likers")
    {
      httpParams = httpParams.append('likers', 'true');
    }
    if(likersParams === "likees")
    {
      httpParams = httpParams.append('likees', 'true');
    }
    return this.http.get<User[]>(this.baseUrl + "users", {
      observe: "response",
      params: httpParams
    }).pipe(map(response => {
      paginationResult.result = response.body;
      if (response.headers.get("Pagination") !== null) {
        paginationResult.pagination = JSON.parse(response.headers.get("Pagination"));
      }
      return paginationResult;
    }));
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + "users/" + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + "users/" + userId + "/photos/" + id + "/setMain", {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + "users/" + userId + "/photos/" + id);
  }

  sendLike(id: number, recipientId: number){
    return this.http.post(this.baseUrl + "users/" + id + "/like/" + recipientId,{});
  }
}
