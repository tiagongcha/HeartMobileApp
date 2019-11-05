import { Component, OnInit } from '@angular/core';
import { WordpressService } from './../services/wordpress.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  post: any;
 
  constructor(private route: ActivatedRoute, private wp: WordpressService) { }
 
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.wp.getPostContent(id).subscribe(res => {
      this.post = res;
    });
  }
 
  openOriginal() {
    // Add InAppBrowser for app if want
    window.open(this.post.link, '_blank');
  }
}
