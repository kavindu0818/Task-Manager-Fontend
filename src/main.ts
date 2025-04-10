import { Routes } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IntroComponent } from './app/components/intro/intro.component';
import { LoginComponent } from './app/components/auth/login.component';
import { SignupComponent } from './app/components/auth/signup.component';
import { TaskListComponent } from './app/components/tasks/task-list.component';

const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'tasks', component: TaskListComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule) // ✅ Fix: Provide HttpClientModule
  ]
}).catch(err => console.error(err));
