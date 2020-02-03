import { Input, OnInit, OnChanges, Component, OnDestroy } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { LogOut } from 'src/app/store/auth/auth.actions';
import { AccesoBDService } from '../../services/acceso-bd.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit, OnDestroy {

  @Input('product') product: Articulo;
  @Input('default-number') defaultNumber: number;

  private shopItem: Articulo = null;
  private lista: Articulo;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;
  subs = new Subscription();
  state;

  constructor(
    private router: Router, private http: HttpClient,
    private store: Store<AppState>, private bd: AccesoBDService,

  ) {
    this.getState = this.store.select((state) => { return state.auth; })
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.shopItem = new Articulo();
    this.subs.add(this.store.subscribe(o => this.state = o));
    if (this.state.auth.isAuthenticated === false) {
      this.router.navigateByUrl('/log-in');
    } else {
      this.user = this.state.auth.user.email;
    }
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

  private goToBasket() {
    this.router.navigate(['/basket']);
  }

  private goToHistorial() {
    this.router.navigate(['/historial']);
  }
}


