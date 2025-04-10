import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private apiUrl = 'http://localhost:8080/api/v1'; // Replace with your backend URL

    constructor(private http: HttpClient) {
        // Check if the user is already authenticated on app start by checking if JWT is present in localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            this.isAuthenticated.next(true);
        }
    }

    // Register method sending data to backend
    register(username: string, email: string, password: string) {
        const user = { username, email, password };
        return this.http.post(`${this.apiUrl}/users/save`, user).pipe(
            catchError((error) => {
                console.error('Registration failed', error);
                throw error;
            })
        );
    }

    // Login method now handles raw token string from the backend
    // AuthService

    login(username: string, password: string) {
        const user = { username, password };
        return this.http.post(this.apiUrl + '/users/login', user, { responseType: 'text' }).pipe(
            catchError((error) => {
                console.error('Login failed', error);
                throw error;
            })
        );
    }


    // Store token and update authentication state
    setAuthToken(token: string) {
        localStorage.setItem('authToken', token);
        this.isAuthenticated.next(true);
    }

    // Logout method
    logout() {
        localStorage.removeItem('authToken');
        this.isAuthenticated.next(false);
    }

    // Observable to track if the user is logged in
    isLoggedIn() {
        return this.isAuthenticated.asObservable();
    }
}
