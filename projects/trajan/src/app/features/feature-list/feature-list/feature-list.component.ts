import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ROUTE_ANIMATIONS_ELEMENTS, AppState } from '../../../core/core.module';
import {
  NodeResponse,
  TagResponse
} from '../../../shared/models/server-models';
import { Receipt } from '../../../shared/models/receipt.model';
import {
  Observable,
  combineLatest,
  Subject,
  BehaviorSubject,
  from
} from 'rxjs';
import { Router } from '@angular/router';
import {
  filter,
  map,
  tap,
  takeUntil,
  debounceTime,
  first,
  publishReplay,
  refCount,
  withLatestFrom,
  delay
} from 'rxjs/operators';
import { ContentDataService } from '../../../shared/providers/content-data/content-data.service';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAccordion,
  MatExpansionPanel
} from '@angular/material';
import { UiMemoryState } from '../../../core/ui-memory/ui-memory.model';
import { Store } from '@ngrx/store';
import { actionUiMemoryFeatureListTabOpenIndexSet } from '../../../core/ui-memory/ui-memory.actions';

@Component({
  selector: 'anms-feature-list',
  templateUrl: './feature-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent implements AfterViewInit, OnDestroy, OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  receiptIngredientTags$: Observable<TagResponse[]>;
  receiptIngredientTagsFiltered$: Observable<TagResponse[]>;

  receiptCategories$: Observable<TagResponse[]>;
  receipts$: Observable<NodeResponse<Receipt>[]>;

  visible = true;
  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputTagIncludeControl = new FormControl();
  allTags: string[] = [];
  filteredTags$: Observable<string[]>;
  tagsSelected: string[] = [];

  formGroup: FormGroup;
  @ViewChild('inputSearchTerm', { static: false }) inputSearchTerm: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('inputTagsInclude', { static: false })
  inputTagsInclude: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  @ViewChildren(MatExpansionPanel) accordionFeatureList: QueryList<
    MatExpansionPanel
  >;

  set searchTerm(v: string) {
    this._searchTerm$.next(v);
  }
  get searchTerm$(): Observable<string> {
    return this._searchTerm$.asObservable();
  }
  private _searchTerm$ = new BehaviorSubject<string>(null);

  receiptCategoryColors = [
    '#ac8391',
    '#3ca8bb',
    '#7ba09b',
    '#5254b3',
    '#147d77',
    '#f554b1',
    '#32acd9'
  ];

  panelIndexCurrent$: Observable<number>;

  private destroyed = new Subject<void>();

  constructor(
    private router: Router,
    private content: ContentDataService<Receipt>,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.receiptIngredientTags$ = from(
      this.content.getTagsOfTagFamily(this.content.tagFamilyIngedrientsUuid)
    );

    this.receiptIngredientTags$
      .pipe(
        map(
          tags =>
            tags &&
            tags
              .map(tag => tag.name)
              .filter(tag => !this.tagsSelected.includes(tag))
        ),
        takeUntil(this.destroyed)
      )
      .subscribe(tags => (this.allTags = tags));

    this.receiptCategories$ = from(this.content.getReceiptCategories());
    this.receipts$ = from(this.content.getReceiptsAll());

    this.filteredTags$ = this.inputTagIncludeControl.valueChanges.pipe(
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );

    this.panelIndexCurrent$ = this.store
      .select(state => state.uiMemory.featureListTabOpenIndex)
      .pipe(filter((index: number | undefined) => Number.isInteger(index)));
  }

  ngAfterViewInit(): void {
    // this._featureListTabOpenIndexSet();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
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
    return combineLatest([this.receipts$, this.searchTerm$]).pipe(
      map(([receipts, searchTerm]: [NodeResponse<Receipt>[], string]) => {
        return receipts.filter(receipt => {
          const matchesReceiptCategory =
            receipt &&
            receipt.tags &&
            receipt.tags.some(tag => {
              return tag.name === receiptCategoryName;
            });
          const matchesSearchTerm =
            receipt && ['', null, undefined].includes(searchTerm)
              ? true
              : new RegExp(searchTerm, 'gi').test(receipt.fields.content);
          const matchesIngredientTag =
            receipt && this.tagsSelected.length === 0
              ? true
              : this.tagsSelected &&
                this.tagsSelected.some(tagSelected => {
                  return receipt.tags
                    .map(tag => tag.name)
                    .includes(tagSelected);
                });
          return (
            matchesReceiptCategory && matchesSearchTerm && matchesIngredientTag
          );
        });
      })
    );
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        this.tagsSelected.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.inputTagIncludeControl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.tagsSelected.indexOf(fruit);
    if (index >= 0) {
      this.tagsSelected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagsSelected.push(event.option.viewValue);
    this.inputTagsInclude.nativeElement.value = '';
    this.inputTagIncludeControl.setValue(null);
  }

  accordionAfterExpand(index: number): void {
    this.store.dispatch(
      actionUiMemoryFeatureListTabOpenIndexSet({
        featureListTabOpenIndex: index
      })
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      tag => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
