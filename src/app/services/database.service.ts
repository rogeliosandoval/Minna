import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IPost } from '../models/IPost';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

  getPosts() {
    return this.http.get<{[id: string]: IPost}>('https://minna-c691d-default-rtdb.firebaseio.com/posts.json').pipe(map(posts => {
      let postData: IPost[] = [];
      for(let id in posts) {
        postData.push({ ...posts[id], id})
      }
      return postData;
    }));
  }

  getPostById(id:any) {
    return this.http.get('https://minna-c691d-default-rtdb.firebaseio.com/posts/'+id+'.json');
  }

  deletePost(id:any) {
    this.db.object("/posts/"+id).remove();
  }

}
