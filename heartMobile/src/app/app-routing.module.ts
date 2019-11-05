import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: 'link', loadChildren: './link/link.module#LinkPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'new', loadChildren: './new/new.module#NewsPageModule' },
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'team-info', loadChildren: './team-info/team-info.module#TeamInfoPageModule' },
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
  { path: 'new', loadChildren: './new/new.module#NewPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}