import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UploaderPage } from './uploader.page';
import { FileSizeFormatPipe } from './file-size-format.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UploaderPage }])
  ],
  declarations: [UploaderPage, FileSizeFormatPipe]
})

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UploaderPage }])
  ]
})
export class UploaderPageModule {}
