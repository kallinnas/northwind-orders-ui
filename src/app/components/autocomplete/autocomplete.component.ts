import { Component, Input, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {
  @Input() suggestions: string[] = [];
  @Output() filterChange = new EventEmitter<string>();

  searchTerm: string = '';
  filteredSuggestions: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['suggestions']) {
      this.filteredSuggestions = this.suggestions;
    }
  }

  onSearchTermChange() {
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterChange.emit(this.searchTerm);
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.filteredSuggestions = this.suggestions.filter(s =>
      s.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterChange.emit(this.searchTerm);
    this.filteredSuggestions = [];
  }

  clearSearchTerm() {
    this.searchTerm = '';
    this.filteredSuggestions = this.suggestions;
    this.filterChange.emit(this.searchTerm);
  }
}
