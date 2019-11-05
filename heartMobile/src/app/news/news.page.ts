import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { WordpressService } from './../services/wordpress.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  posts = [];
  page = 1;
  count = null;

  constructor(private wp: WordpressService, private loadingCtrl: LoadingController) { }
 
  ngOnInit() {
    this.loadPosts();
  }
 
  async loadPosts() {
    let loading = await this.loadingCtrl.create({
      message: 'Loading Data...'
    });
    await loading.present();
 
    this.wp.getPosts().subscribe(res => {
      this.count = this.wp.totalPosts;
      this.posts = res;
      loading.dismiss();
    });
  }
 
  loadMore(event) {
    this.page++;
 
    this.wp.getPosts(this.page).subscribe(res => {
      this.posts = [...this.posts, ...res];
      event.target.complete();
 
      // Disable infinite loading when maximum reached
      if (this.page == this.wp.pages) {
        event.target.disabled = true;
      }
    });
  }

}
