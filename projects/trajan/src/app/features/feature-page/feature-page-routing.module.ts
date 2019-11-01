import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturePageComponent } from './feature-page/feature-page.component';

const routes: Routes = [
  {
    path: '',
    component: FeaturePageComponent,
    data: { title: 'anms.menu.receipt' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturePageRoutingModule {}
