import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      // {
      //   path: 'uploader',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../uploader/uploader.module').then(m => m.UploaderPageModule)
      //     }
      //   ]
      // },
      {
        path: 'calendar',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../calendar/calendar.module').then(m => m.CalendarPageModule)
          }
        ]
      },
      // {
      //   path: 'link',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../link/link.module').then(m => m.LinkPageModule)
      //     }
      //   ]
      // },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
