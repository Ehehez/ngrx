import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FichaArticuloService } from 'src/app/services/ficha-articulo.service';
import { Articulo } from 'src/app/models/articulo';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ficha-articulo',
  templateUrl: './ficha-articulo.component.html',
  styleUrls: ['./ficha-articulo.component.css']
})
export class FichaArticuloComponent implements OnInit {


  articulo: Articulo;
  state;
  subs = new Subscription();
  cont = 0;
  categorias;
  id;
  user;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private bd: AccesoBDService,
    private store: Store<AppState>) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(params => {
      this.id = +params['id']
    });
    this.bd.getArticulo(+this.id).subscribe((x) => {
      this.articulo = x;
      console.log(this.articulo);
      this.articulo.Images.forEach((x) => {
        x.url = 'http://localhost:1337' + x.url;
      })
    });

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

  }

  getCategoria(list) {
    for (let index = 0; index < this.cont; index++) {
      if (this.categorias[index].id == list.IdCategoria) {
        return this.categorias[index].Name;
      }

    }

    return "";
  }

}
