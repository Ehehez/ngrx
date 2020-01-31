import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { LogOut } from 'src/app/store/auth/auth.actions';
import { Subscription } from 'rxjs';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit, OnDestroy {

  private subs = new Subscription();
  public compras$;
  public compras = [];
  getState;
  user;
  state;

  constructor(private store: Store<AppState>, private http: HttpClient,
    private router: Router, private basket: BasketService,
    private bd: AccesoBDService) {
    this.getState = this.store.select('auth');

  }

  ngOnInit() {
    this.subs.add(this.store.subscribe(o => this.state = o));
    if (!this.state.auth.isAuthenticated) {
      this.router.navigateByUrl('/log-in');
    } else {
      this.user = this.state.auth.user.email;
      this.subs.add(this.bd.getOrders().subscribe((data) => {
        data.forEach(orden => {
          if (orden.Comprador == this.user) {
            this.compras.push(orden);
          }
        })
      }));
    }
  }

  goToProducts() {
    this.router.navigateByUrl('/productos');
  }

  goToBasket() {
    this.router.navigateByUrl('/basket');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  logOut() {
    this.store.dispatch(new LogOut);
    localStorage.clear();
    if (this.state.auth.isAuthenticated == false) {
      this.router.navigateByUrl('/log-in');
    }
  }
}




