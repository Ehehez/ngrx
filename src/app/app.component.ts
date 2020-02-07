import { Component, OnDestroy, HostListener, OnInit } from '@angular/core';
import { AppState } from './store/app.states';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LogOut } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Shap';
  subs = new Subscription();
  state;
  user;

  constructor(private store: Store<AppState>,
    private router: Router,

  ) {

  }

  ngOnInit() {
    this.subs.add(this.store.subscribe(x => {
      this.state = x;
      this.user = this.state.auth.user.email
    }));
  }

  private goToBasket() {
    this.router.navigate(['/basket']);
  }

  private goToHistorial() {
    this.router.navigate(['/historial']);
  }

  private goToProducts() {
    this.router.navigateByUrl('');
  }

  logOut() {
    this.store.dispatch(new LogOut);
    setTimeout(() => {
      if (this.state.auth.isAuthenticated == false) {
        localStorage.clear();
        this.router.navigateByUrl('/log-in');
      }
    }, 100)
  }
}
