import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { Subscription } from 'rxjs';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogOut } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, OnDestroy {


  state;
  subs = new Subscription();
  categorias;
  form;
  error;
  lista;
  size;
  page;
  pageSize;
  aux2;
  aux = [];
  cont = 0;
  constructor(private store: Store<AppState>,
    private bd: AccesoBDService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.subs.add(this.store.subscribe((x) => this.state = x));
    this.subs.add(this.bd.getArticulos().subscribe(x => {
      this.lista = x;
      this.aux2 = x;
      this.size = this.lista.length;
    }))
    this.subs.add(this.bd.getCategorias().subscribe((a) => {
      this.categorias = a;
      this.categorias.forEach((x) => {
        this.cont++;
        if (x.CategoriaPadre != null) {
          let a = this.categorias.find((c) => x.CategoriaPadre == c.id);
          x.Name = a.Name + " > " + x.Name;
        }
      });
    }));
    this.form = new FormGroup({
      name: new FormControl(''),
      price: new FormControl(''),
      quantity: new FormControl(''),
      IdCategoria: new FormControl(''),
      id: new FormControl(''),
    }
    )
    this.page = 1;
    this.pageSize = 5;
  }

  onSubmit() {
    console.log(this.form.value);
    this.subs.add(this.bd.setArticulo(this.form.value).subscribe((x) => console.log(x)));

    let a = this.lista.findIndex((x) => x.id == this.form.value.id);

    this.lista[a].name = this.form.value.name;
    this.lista[a].price = this.form.value.price;
    this.lista[a].quantity = this.form.value.quantity;

    this.modalService.dismissAll();

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
  goToRemove() {
    this.router.navigateByUrl('/delprod');
  }

  goToAddCat() {
    this.router.navigateByUrl('/addcat');
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  open(content, id) {
    this.modalService.open(content);
    let a;
    this.subs.add(this.bd.getArticulo(id).subscribe(x => {
      a = x;
      this.form.patchValue({
        id: a.id,
        name: a.name,
        price: a.price,
        quantity: a.quantity,
        IdCategoria: a.IdCategoria
      })
      /*this.form.IdCategoria = a.IdCategoria;*/
    }));

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



  getCategoria(list) {
    for (let index = 0; index < this.cont; index++) {
      if (this.categorias[index].id == list.IdCategoria) {
        return this.categorias[index].Name;
      }

    }

    return "";
  }



}
