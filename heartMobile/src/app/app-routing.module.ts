import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'idea-submit', loadChildren: './idea-submit/idea-submit.module#IdeaSubmitPageModule' },
  { path: '', redirectTo: 'login', pathMatch:'full'},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
