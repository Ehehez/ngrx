import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'src/app/models/articulo';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LogOut } from 'src/app/store/auth/auth.actions';
import { ShopItem } from 'src/app/models/shopItem';
import { ShopcartAction } from 'src/app/models/shopcartAction';
import { ShopcartActionTypes } from 'src/app/store/shopcart/shopcart.actions';

@Component({
  selector: 'app-ficha-articulo',
  templateUrl: './ficha-articulo.component.html',
  styleUrls: ['./ficha-articulo.component.css']
})
export class FichaArticuloComponent implements OnInit {

  imgList = [];
  articulo: Articulo[] = [];
  artic: Articulo;
  state;
  subs = new Subscription();
  cont = 0;
  categorias;
  id;
  user;
  shopItem = new ShopItem();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bd: AccesoBDService,
    private store: Store<AppState>) {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log(this.id);
    });
    this.subs.add(this.bd.getArticulo(+this.id).subscribe((x) => {
      this.articulo.push(x);
      this.articulo.forEach((x) => {
        x.images.forEach((x: any) => {
          if (x.id != undefined) {
            this.imgList.push(x);
          }
        })
      })
    }));
    this.artic = this.articulo[0];
    this.subs.add(this.store.subscribe((x) => this.state = x));
    this.user = this.state.auth.user.email;
    this.subs.add(this.bd.getCategorias().subscribe((x) => {
      this.categorias = x;
      this.categorias.forEach((x) => {
        this.cont++;
        if (x.CategoriaPadre != null) {
          let a = this.categorias.find((c) => x.CategoriaPadre == c.id);
          x.Name = a.Name + " > " + x.Name;
        }
      });
    }))
  }

  ngOnInit() {
    if (this.state.auth.user.role === "Admin") {
      document.getElementById('menu').style.visibility = "hidden";
      document.getElementById('menu').style.display = "none";
      document.getElementById('btn-añadir').style.visibility = "visible";
    }
  }

  getCategoria(list) {
    for (let index = 0; index < this.cont; index++) {
      if (this.categorias[index].id == list.IdCategoria) {
        return this.categorias[index].Name;
      }

    }

    return "";
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

  goToRemove() {
    this.router.navigateByUrl('/delprod');
  }

  goToAddCat() {
    this.router.navigateByUrl('/addcat');
  }
  goToAdd() {
    this.router.navigateByUrl('/addprod');
  }

  private goToBasket() {
    this.router.navigate(['/basket']);
  }

  private goToHistorial() {
    this.router.navigate(['/historial']);
  }

  private goToProducts() {
    this.router.navigate(['/']);
  }
}
