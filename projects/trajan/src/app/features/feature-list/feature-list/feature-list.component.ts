import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import {
  NodeResponse,
  TagResponse
} from '../../../shared/models/server-models';
import { Receipt } from '../../../shared/models/receipt.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { filter, map, tap, startWith } from 'rxjs/operators';
import { ContentDataService } from '../../../shared/providers/content-data/content-data.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent
} from '@angular/material';

interface FeatureListFormGroup {
  searchTerm: FormControl | string;
  tagsInclude: FormControl | any;
}

@Component({
  selector: 'anms-feature-list',
  templateUrl: './feature-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  receiptIngredientTags$: Observable<TagResponse[]>;
  receiptIngredientTagsFiltered$: Observable<TagResponse[]>;

  receiptCategories$: Observable<TagResponse[]>;
  receipts$: Observable<NodeResponse<Receipt>[]>;

  tagsSelected: TagResponse[] = [];
  visible = true;
  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  formGroup: FormGroup;
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  formGroupInitControl: FeatureListFormGroup = {
    searchTerm: new FormControl(''),
    tagsInclude: new FormControl([
      this.tagsSelected,
      FeatureListComponent.validateRequired
    ])
  };

  get formGroupValues$(): Observable<FeatureListFormGroup> {
    return this.formGroup.valueChanges;
  }

  receiptCategoryColors = [
    '#ac8391',
    '#3ca8bb',
    '#7ba09b',
    '#5254b3',
    '#147d77',
    '#f554b1',
    '#32acd9'
  ];

  static validateRequired(c: FormControl) {
    if (c.value.length === 0) {
      return { required: true };
    } else {
      return null;
    }
  }

  constructor(
    private router: Router,
    private content: ContentDataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.receiptIngredientTags$ = this.content.getTagsOfTagFamily(
      this.content.tagFamilyIngedrientsUuid
    );
    this.receiptIngredientTagsFiltered$ = this.receiptIngredientTags$.pipe(
      map(items =>
        items.filter(item => {
          return new RegExp(
            `(${this.formGroup.get('tagsInclude').value})`,
            'gi'
          ).test(item.name);
        })
      )
    );

    this.receiptCategories$ = this.content.getReceiptCategories();
    this.receipts$ = this.content.getReceiptsAll();

    this.formGroup = this.formBuilder.group(this.formGroupInitControl);

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
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

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      fruit => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
