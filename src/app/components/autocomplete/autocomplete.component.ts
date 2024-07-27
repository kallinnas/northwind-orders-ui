import { Component, Input, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {
  @Input() matchesAC: string[] = [];
  @Output() filterChange = new EventEmitter<string>();

  searchTerm: string = '';
  filteredMatches: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredMatches']) {
      this.filteredMatches = this.matchesAC;
    }
  }

  onSearchTermChange() {
    this.filteredMatches = this.matchesAC.filter(match => match.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.filterChange.emit(this.searchTerm);
  }

  selectMatch(match: string) {
    this.searchTerm = match;
    this.filteredMatches = this.matchesAC.filter(s => s.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.filterChange.emit(this.searchTerm);
    this.filteredMatches = [];
  }

  clearSearchTerm() {
    this.searchTerm = '';
    this.filteredMatches = this.matchesAC;
    this.filterChange.emit(this.searchTerm);
  }
}
