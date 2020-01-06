import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { Receipt } from '../../../shared/models/receipt.model';
import { NodeResponse } from '../../../shared/models/server-models';
import { ContentDataService } from '../../../shared/providers/content-data/content-data.service';

@Component({
  selector: 'anms-feature-page',
  templateUrl: './feature-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturePageComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  /** MeshNode or routing result if MeshNode not existing */
  receipt$: Observable<NodeResponse<Receipt> | boolean | Error>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private content: ContentDataService<Receipt>
  ) {}

  ngOnInit() {
    // get receipt
    this.receipt$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('uuid')),
      switchMap((uuid: string) =>
        from(this.content.getReceipt(uuid)).pipe(
          catchError(() => this._navigateToHome())
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

  private _navigateToHome(): Promise<boolean> {
    return this.router.navigateByUrl('/feature-list');
  }
}
