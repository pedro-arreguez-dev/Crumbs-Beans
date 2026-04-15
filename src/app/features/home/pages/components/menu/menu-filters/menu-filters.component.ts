import { Component, Input, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-menu-filters',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './menu-filters.component.html',
  styleUrl: './menu-filters.component.scss',
  standalone: true
})
export class MenuFiltersComponent {
  @Input({required: true}) selectedCategory!: WritableSignal<string>;
  @Input({required: true}) filters!: WritableSignal<any>;

  filtersForm!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    // inicializar form con valores del padre
    this.filtersForm = this.fb.group({
      vegan: [this.filters().vegan],
      search: [this.filters().search]
    });

    this.filtersForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.filters.set(values);
      });
  }

  onSelectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
