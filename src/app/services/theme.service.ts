import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);

  toggleTheme() {
    this.isDarkMode.next(!this.isDarkMode.value);
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
  }

  getTheme() {
    return this.isDarkMode.asObservable();
  }
}