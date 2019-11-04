import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  
  { path: 'team-info', loadChildren: './team-info/team-info.module#TeamInfoPageModule' },
  { path: 'drive', loadChildren: './drive/drive.module#DrivePageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: 'link', loadChildren: './link/link.module#LinkPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
