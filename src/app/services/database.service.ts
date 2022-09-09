import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IPost } from '../models/IPost';
import { IComment } from '../models/IComment';
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

  getComments(id:any) {
    return this.http.get<{[id: string]: IComment}>('https://minna-c691d-default-rtdb.firebaseio.com/posts/'+id+'/comments.json').pipe(map(comments => {
      let commentData: IComment[] = [];
      for(let id in comments) {
        commentData.push({ ...comments[id], id})
      }
      return commentData;
    }));
  }

  async deletePost(id:any) {
    await this.db.object("/posts/"+id).remove();
  }

  async deleteComment(id:any, commentid:any) {
    await this.db.object("/posts/"+id+"/comments/"+commentid).remove();
  }

}
