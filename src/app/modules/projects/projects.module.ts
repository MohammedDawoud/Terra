import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { PreviewComponent } from './preview/preview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MeetingComponent } from './meeting/meeting.component';

@NgModule({
  declarations: [
    PreviewComponent,
    MeetingComponent,

  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    MatPaginatorModule,
    FileUploadModule,
    DragDropModule
  ],
  providers: [BsModalService],
})
export class ProjectsModule {}
