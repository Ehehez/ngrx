import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { Subscription } from 'rxjs';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogOut } from 'src/app/store/auth/auth.actions';
import { HttpClient } from '@angular/common/http';
import Strapi from 'strapi-sdk-javascript';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, OnDestroy {

  idImg;
  imgList = [];
  imgs;
  state;
  subs = new Subscription();
  categorias;
  categor;
  form;
  error;
  lista;
  size;
  page;
  pageSize;
  aux2;
  aux = [];
  cont = 0;
  elPerPage = [5, 10, 20, 50];
  images;
  cont2 = 0;
  formul = new FormData();

  constructor(private store: Store<AppState>,
    private bd: AccesoBDService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private http: HttpClient) {

  }

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
      this.categor = [...this.categorias];
      this.categorias.unshift({ id: "", Name: "Todos" });
    }));
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      IdCategoria: new FormControl('', Validators.required),
      id: new FormControl(''),
      Url: new FormControl(''),

    });
    this.imgs = new FormGroup({
      images: new FormControl(''),
    })
    this.page = 1;
    this.pageSize = 5;


  }

  onSubmit() {

    if (this.form.value.id != "") {
      let a;
      this.subs.add(this.bd.getArticulosNameCat(this.form.value).subscribe((x) => {

        a = x;
        if ((a.length == 1 && a[0].id == this.form.value.id) || a.length == 0) {

          this.subs.add(this.bd.setArticulo(this.form.value).subscribe((x) => { }));
          this.uploadStrapi(this.form.value.id);
          let a = this.lista.findIndex((x) => x.id == this.form.value.id);
          this.lista[a].name = this.form.value.name;
          this.lista[a].price = this.form.value.price;
          this.lista[a].quantity = this.form.value.quantity;
          this.lista[a].IdCategoria = this.form.value.IdCategoria;
          this.toastr.success("Artículo modificado");
        } else {
          this.toastr.error("Ya existe un articulo con esa combinación de nombre y categoria");
        }
        this.modalService.dismissAll();
      }));


    }
    else {
      document.getElementById('modal-basic-title').innerHTML = "Añadir Artículo";
      let a;
      this.subs.add(this.bd.getArticulosNameCat(this.form.value).subscribe((x) => {
        a = x;
        if (a.length > 0) {
          this.toastr.error("Ya existe un articulo con ese nombre y categoria");
        } else {
          this.subs.add(this.bd.createArticulo(this.form.value).subscribe((x) => { }));
          this.toastr.success("Artículo añadido");
          this.lista.push(this.form.value);
          this.size++;
          this.modalService.dismissAll();
        }
      }));


    }


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

  open(content, id?) {
    let a = this.categor.findIndex((x) => x.Name == "Todos");
    if (a != -1) {
      this.categor[a].Name = "";
    }
    this.modalService.open(content);
    if (id != undefined) {
      document.getElementById('modal-basic-title').innerHTML = "Editar Artículo";
      let a;
      this.subs.add(this.bd.getArticulo(id).subscribe(x => {
        a = x;
        this.form.patchValue({
          id: a.id,
          name: a.name,
          price: a.price,
          quantity: a.quantity,
          IdCategoria: a.IdCategoria,
          Url: a.Url
        })
        /*this.form.IdCategoria = a.IdCategoria;*/
      }));
    } else {
      document.getElementById('modal-basic-title').innerHTML = "Añadir Artículo";
      this.form.patchValue({
        id: "",
        name: "",
        price: "",
        quantity: "",
        IdCategoria: ""
      })
    }

  }

  editImages(content, list) {
    this.selectedFile = [];
    this.idImg = "";
    this.buildImgList(list);
    this.idImg = list.id;
    setTimeout((x) => {
      this.modalService.open(content);
    }, 500);

  }

  buildImgList(list) {
    this.imgList = [];
    list.images.forEach(element => {
      if (element.id != undefined) {
        this.imgList.push(element);
      }
    });
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
    if (id != "") {
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
    for (let index = 1; index <= this.cont; index++) {
      if (this.categorias[index].id == parseInt(list.IdCategoria)) {
        return this.categorias[index].Name;
      }

    }

    return "";
  }

  delete(id) {
    let a = this.lista.findIndex((element) => element.id == id);
    if (confirm("Se va a borrar " + this.lista[a].name)) {
      this.subs.add(this.bd.deleteProd(id).subscribe(x => { }));
      this.lista.splice(a, 1);
      this.size--;
    }
  }

  changeSize() {
    this.pageSize = parseInt((<HTMLInputElement>document.getElementById('epp')).value);
  }

  selectedFile = [];


  onFileChanged(event) {

    this.selectedFile.push(event.target.files[0]);

  }

  async uploadStrapi(id) {
    const strapi = new Strapi('http://localhost:1337');
    const form = new FormData();
    this.selectedFile.forEach((x) => {
      form.append('files', x, x.name);
    }
    )
    form.append("refId", this.idImg); // User's Id.
    form.append("ref", "Articulo") // Model name.
    form.append("field", "images") // Field name in the model.
    this.selectedFile = [];
    const files = await strapi.upload(form);
    this.subs.add(this.bd.getArticulos().subscribe((x) => {
      this.lista = x;
      let a = this.lista.find((element) => element.id == this.idImg);
      this.buildImgList(a);
    }));
  }

  borrarImagen(id) {
    let a = this.imgList.findIndex((element) => element.id == id);

    if (confirm("Se va a borrar esta imagen")) {
      /*this.imgList.splice(a, 1);*/
      this.subs.add(this.http.delete("http://localhost:1337/upload/files/" + id).subscribe(x => {
        this.subs.add(this.bd.getArticulos().subscribe((x) => {
          this.lista = x;
          let a = this.lista.find((element) => element.id == this.idImg);
          this.buildImgList(a);
        }));
      }));

    }

  }
}