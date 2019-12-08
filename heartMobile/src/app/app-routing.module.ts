import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: 'link', loadChildren: './link/link.module#LinkPageModule' },
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },

  { path: 'team-info', loadChildren: './team-info/team-info.module#TeamInfoPageModule' },

  { path: 'drive', loadChildren: './drive/drive.module#DrivePageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: 'link', loadChildren: './link/link.module#LinkPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  // { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  // { path: 'news', loadChildren: './news/news.module#NewsPageModule' }

  // { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
  { path: 'posts', loadChildren: './posts/posts.module#PostsPageModule' },
  { path: 'posts/:id', loadChildren: './post/post.module#PostPageModule' },
  { path: 'post', loadChildren: './post/post.module#PostPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule
=======

const routes: Routes = [
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'team-info', loadChildren: './team-info/team-info.module#TeamInfoPageModule' },
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
>>>>>>> 901ef3209077c425f9ebe01f8f7641d2f639d856
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
