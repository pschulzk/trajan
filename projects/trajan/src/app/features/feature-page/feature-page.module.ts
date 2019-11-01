import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { FeaturePageComponent } from './feature-page/feature-page.component';
import { FeaturePageRoutingModule } from './feature-page-routing.module';

@NgModule({
  declarations: [FeaturePageComponent],
  imports: [CommonModule, SharedModule, FeaturePageRoutingModule]
})
export class FeaturePageModule {}
