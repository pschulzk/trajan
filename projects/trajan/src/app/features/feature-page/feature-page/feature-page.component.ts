import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { NodeResponse } from '../../../shared/models/server-models';
import { Receipt } from '../../../shared/models/receipt.model';
import { Observable, Subject, of } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { filter, map, switchMap, catchError } from 'rxjs/operators';
import { ContentDataService } from '../../../shared/providers/content-data/content-data.service';

@Component({
  selector: 'anms-feature-page',
  templateUrl: './feature-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturePageComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  receipt$: Observable<NodeResponse<Receipt | undefined>>;

  destroyed$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private content: ContentDataService<Receipt>
  ) {}

  ngOnInit() {
    // get receipt
    this.receipt$ = this.route.paramMap.pipe(
      filter((params: ParamMap) => params.has('uuid')),
      map((params: ParamMap) => params.get('uuid')),
      switchMap((uuid: string) =>
        this.content.getReceipt(uuid).pipe(
          catchError(() => {
            this.router.navigateByUrl('/feature-list');
            return of(undefined);
          })
        )
      )
    );
  }

  getNodeFieldBinary(nodeUuid: string, thumbnail: string): string {
    return this.content.getNodeFieldBinaryUrl(nodeUuid, thumbnail);
  }

  onContentItemClick(nodeUuid: string): void {
    this.router.navigate(['/' + nodeUuid]);
  }
}
