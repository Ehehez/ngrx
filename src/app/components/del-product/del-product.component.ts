import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { Subscription } from 'rxjs';
import { LogOut } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-del-product',
  templateUrl: './del-product.component.html',
  styleUrls: ['./del-product.component.css']
})
export class DelProductComponent implements OnInit {

  subs = new Subscription();
  lista;
  size;
  aux2;
  state;
  page;
  pageSize;
  categorias;
  aux = [];

  constructor(private router: Router,
    private http: HttpClient,
    private store: Store<AppState>, private bd: AccesoBDService, ) { }

  ngOnInit() {
    this.subs.add(this.bd.getArticulos().subscribe(list => {
      this.lista = list;
      this.size = this.lista.length;
      this.aux2 = list;
    }));
    this.subs.add(this.store.subscribe((x) => this.state = x));

    this.page = 1;
    this.pageSize = 10;
    this.subs.add(this.bd.getCategorias().subscribe((x) => {
      this.categorias = x;
      this.categorias.unshift({ id: 0, Name: "Todos" });
      this.categorias.forEach((x) => {
        if (x.CategoriaPadre != null) {
          let a = this.categorias.find((c) => x.CategoriaPadre == c.id);
          x.Name = a.Name + " > " + x.Name;
        }
      });
    }))
    if (this.state.auth.user.role == "Admin") {
      let a = document.getElementById('menu');
      a.style.display = "none";
    }
  }

  goToAdd() {
    this.router.navigateByUrl('/addprod');
  }

  delete(id) {
    this.subs.add(this.bd.deleteProd(id).subscribe(x => { }));
    let a = this.lista.findIndex((element) => element.id == id);
    this.lista.splice(a, 1);
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


  goToAddCat() {
    this.router.navigateByUrl('/addcat');
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
}
