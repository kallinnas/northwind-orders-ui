import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {

  isDarkTheme: boolean = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
      this.updateBodyClass();
    }
  }

  toggleTheme() {
    if (this.isBrowser) {
      this.isDarkTheme = !this.isDarkTheme;
      this.updateBodyClass();
    }
  }

  private updateBodyClass() {
    const body = document.body;
    
    if (this.isDarkTheme) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    } 
    
    else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  }
}
