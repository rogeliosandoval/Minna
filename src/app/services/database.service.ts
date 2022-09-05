import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../models/IPost';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<{[id: string]: IPost}>('https://minna-c691d-default-rtdb.firebaseio.com/posts.json').pipe(map(posts => {
      let postData: IPost[] = [];
      for(let id in posts) {
        postData.push({ ...posts[id], id})
      }
      return postData;
    }));
  }
}
