import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { NodeResponse, TagResponse } from '../../../shared/models/server-models';
import { Receipt } from '../../../shared/models/receipt.model';
import { ContentService } from '../../../shared/providers/content/content.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map, takeUntil, share, shareReplay, refCount, take, publishReplay, first } from 'rxjs/operators';

@Component({
  selector: 'anms-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  receiptCategories$: Observable<TagResponse[]>;
  receiptCategories: TagResponse[];

  receipts$: Observable<NodeResponse<Receipt>[]>;

  // destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    // private changeDetectorRef: ChangeDetectorRef,
    private contentService: ContentService,
  ) { }

  ngOnInit() {
    // this.settings$ = this.store.pipe(select(selectSettings));

    this.receiptCategories$ = this.contentService.getReceiptCategories();
    // this.receiptCategories$.pipe(
    //   takeUntil(this.destroyed$),
    // ).subscribe((receiptCategories: TagResponse[]) => {
    //   this.receiptCategories = receiptCategories;
    //   this.changeDetectorRef.markForCheck();
    // });
    this.receipts$ = this.contentService.getReceiptsOfProject();
  }

  // ngOnDestroy(): void {
  //   this.destroyed$.next();
  //   this.destroyed$.complete();
  // }

  getNodeFieldBinary(nodeUuid: string, thumbnail: string): string {
    return this.contentService.getNodeFieldBinaryUrl(nodeUuid, thumbnail);
  }

  onContentItemClick(nodeUuid: string): void {
    this.router.navigateByUrl( `/feature-page/${nodeUuid}` );
  }

  getReceiptsOfReceiptCategory(receiptCategoryName: string): Promise<NodeResponse<Receipt>[]> {
    return this.receipts$.pipe(
      map((receipts: NodeResponse<Receipt>[]) => {
        return receipts.filter(receipt => receipt && receipt.tags.find(tag => tag.name === receiptCategoryName) ? true : false)
      }),
      // publishReplay(1),
      shareReplay(1),
      // refCount(),
      take(1),
      first(),
    ).toPromise();
  }

}
