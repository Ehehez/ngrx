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
  private lista;
  getState: Observable<any>;
  isAuthenticated = false;
  user = null;
  errorMessage = null;
  subs = new Subscription();
  state;
  categorias;
  aux = [];
  aux2;
  size;
  page;
  pageSize;
  auxcat;
  cont = 0;

  elPerPage = [5, 10, 20, 50];

  constructor(
    private router: Router, private http: HttpClient,
    private store: Store<AppState>, private bd: AccesoBDService,

  ) {
    this.getState = this.store.select((state) => { return state.auth; })
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
      this.size = this.lista.length;
      this.aux2 = list;
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.page = 1;
    this.pageSize = 5;
    this.subs.add(this.bd.getCategorias().subscribe((x) => {
      this.categorias = x;
      this.auxcat = x;
      this.categorias.unshift({ id: 0, Name: "Todos" });
      this.categorias.forEach((x) => {
        this.cont++;
        if (x.CategoriaPadre != null) {
          let a = this.categorias.find((c) => x.CategoriaPadre == c.id);
          x.Name = a.Name + " > " + x.Name;
        }
      });
    }))



    this.shopItem = new Articulo();
    this.subs.add(this.store.subscribe(o => this.state = o));
    if (this.state.auth.isAuthenticated === false) {
      this.router.navigateByUrl('/log-in');
    } else {
      this.user = this.state.auth.user.email;
      let a = document.getElementById('btn-añadir');
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

  filter() {
    this.lista = this.aux2;

    let id = (<HTMLInputElement>document.getElementById('cat')).value;
    if (id != "0") {
      for (let index = 0; index < this.lista.length; index++) {
        if (this.lista[index].IdCategoria == id) {
          this.aux.push(this.lista[index]);
        } else {
          this.categorias.forEach(element => {
            if (element.CategoriaPadre == id && element.id == this.lista[index].IdCategoria) {
              this.aux.push(this.lista[index]);
            }
          });
        }
      }
      this.lista = this.aux;
      this.aux = [];
    }
    this.size = this.lista.length;
  }

  goToAdd() {
    this.router.navigateByUrl('/addprod');
  }
  goToRemove() {
    this.router.navigateByUrl('/delprod');
  }

  goToAddCat() {
    this.router.navigateByUrl('/addcat');
  }

  getCategoria(list) {
    for (let index = 0; index < this.cont; index++) {
      if (this.categorias[index].id == list.IdCategoria) {
        return this.categorias[index].Name;
      }

    }

    return "";
  }

  changeSize() {
    this.pageSize = parseInt((<HTMLInputElement>document.getElementById('epp')).value);
  }

  details(id) {
    this.router.navigateByUrl('/articulo/' + id);
  }
}
