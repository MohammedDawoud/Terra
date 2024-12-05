import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewComponent } from './preview/preview.component';
import { MeetingComponent } from './meeting/meeting.component';
import { DesignComponent } from './design/design.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'preview', component: PreviewComponent },
  { path: 'meeting', component: MeetingComponent },
  { path: 'design', component: DesignComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
