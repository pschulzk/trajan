import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import {
  NodeResponse,
  TagResponse
} from '../../../shared/models/server-models';
import { Receipt } from '../../../shared/models/receipt.model';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map, shareReplay, take, first } from 'rxjs/operators';
import { ContentDataService } from '../../../shared/providers/content-data/content-data.service';

@Component({
  selector: 'anms-feature-list',
  templateUrl: './feature-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  receiptCategories$: Observable<TagResponse[]>;
  receiptCategories: TagResponse[];
  receipts$: Observable<NodeResponse<Receipt>[]>;

  constructor(private router: Router, private content: ContentDataService) {}

  ngOnInit() {
    this.receiptCategories$ = this.content.getReceiptCategories();
    this.receipts$ = this.content.getReceiptsAll();
  }

  getNodeFieldBinary(nodeUuid: string, thumbnail: string): string {
    return this.content.getNodeFieldBinaryUrl(nodeUuid, thumbnail);
  }

  onContentItemClick(nodeUuid: string): void {
    this.router.navigateByUrl(`/feature-page/${nodeUuid}`);
  }

  getReceiptsOfReceiptCategory(
    receiptCategoryName: string
  ): Observable<NodeResponse<Receipt>[]> {
    return this.receipts$.pipe(
      map((receipts: NodeResponse<Receipt>[]) => {
        return receipts.filter(receipt =>
          receipt && receipt.tags.find(tag => tag.name === receiptCategoryName)
            ? true
            : false
        );
      })
    );
  }
}
