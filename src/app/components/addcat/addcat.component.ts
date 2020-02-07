import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-addcat',
  templateUrl: './addcat.component.html',
  styleUrls: ['./addcat.component.css']
})
export class AddcatComponent implements OnInit {


  state;
  subs = new Subscription();
  categorias;
  catPadre = [];
  form: FormGroup;
  size;
  pageSize;
  page;
  elPerPage = [5, 10, 20, 50];

  constructor(private store: Store<AppState>,
    private bd: AccesoBDService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.subs.add(this.store.subscribe((x) => this.state = x));
    this.pageSize = 5;
    this.page = 1;
    this.subs.add(this.bd.getCategorias().subscribe((a) => {
      this.catPadre = [];
      this.catPadre.unshift({ id: null, Name: "" });
      this.categorias = a;
      this.size = this.categorias.length;

      this.categorias.forEach((x) => {
        if (x.CategoriaPadre == null) {
          this.catPadre.push(x);
        }
      });
    }));

    this.form = new FormGroup({
      Name: new FormControl('', Validators.required),
      CategoriaPadre: new FormControl(''),
      id: new FormControl(''),
    });

  }

  /*onSubmit() {
    console.log(this.form.value);
    let result;
    this.subs.add(this.bd.getCatName(this.form.value).subscribe((x) => {
      result = x;
      if (result.length > 0) {
        this.toastr.error("Ya existe una categoria con esa combinación de nombre y categoría padre");
      } else {
        this.subs.add(this.bd.createCategoria(this.form.value).subscribe((x) => console.log(x)));
        this.toastr.success("Categoría añadida");
        if (this.form.value.CategoriaPadre == null) {
          let payload = {
            Name: this.form.value.Name,
            CategoriaPadre: "",
          }
          this.catPadre.push(payload);
        }
        this.form.reset();
      }
    }));


  }*/

  goToAdd() {
    this.router.navigateByUrl('/addprod');
  }

  getCategoria(cat) {
    for (let index = 0; index < this.categorias.length; index++) {
      if (this.categorias[index].id == cat.CategoriaPadre) {
        return this.categorias[index].Name;
      }

    }

    return "";
  }


  onSubmit() {
    if (this.form.value.id != "") {
      let a = this.categorias.findIndex((x) => x.Name == this.form.value.Name);
      if (this.categorias[a].id == this.form.value.CategoriaPadre) {
        this.toastr.error("Una categoría no puede tenerse a si misma de categoría padre.")
      }
      else {
        if (this.form.value.CategoriaPadre == 0) {
          this.form.patchValue({
            CategoriaPadre: null,
          })
        }
        this.subs.add(this.bd.setCategoria(this.form.value, this.categorias[a].id).subscribe((x) => { }));
        this.categorias[a].Name = this.form.value.Name;
        this.categorias[a].CategoriaPadre = this.form.value.CategoriaPadre;
        this.modalService.dismissAll();
      }

    } else {
      let a;
      let payload = {
        Name: this.form.value.Name,
        CategoriaPadre: this.form.value.CategoriaPadre,
      }
      if (payload.CategoriaPadre == 0 || payload.CategoriaPadre == "") {
        payload.CategoriaPadre = null;
      }
      this.subs.add(this.bd.getCatName(payload).subscribe((x) => {
        a = x;
        if (a.length > 0) {
          this.toastr.error("Ya existe una categoria con esa combinación de nombre y categoría padre");
        } else {
          this.subs.add(this.bd.createCategoria(this.form.value).subscribe((x) =>
            this.categorias.push(x)));
          this.toastr.success("Categoría añadida");
          if (this.form.value.CategoriaPadre == null || this.form.value.CategoriaPadre == "") {
            let payload = {
              Name: this.form.value.Name,
              CategoriaPadre: "",
            }
            this.catPadre.push(payload);
          }
        }
      }));
    }
    this.modalService.dismissAll();
  }

  open(content, id?) {
    this.modalService.open(content);
    if (id != undefined) {
      document.getElementById('modal-basic-title').innerHTML = "Editar Categoría";
      let a;
      this.subs.add(this.bd.getCategoria(id).subscribe(x => {
        a = x;
        this.form.patchValue({
          Name: a.Name,
          CategoriaPadre: a.CategoriaPadre,
          id: a.id,
        })
        /*this.form.IdCategoria = a.IdCategoria;*/
      }));
    }
    else {
      document.getElementById('modal-basic-title').innerHTML = "Nueva Categoría";
      this.form.patchValue({
        Name: "",
        CategoriaPadre: "",
        id: ""
      })
    }
  }

  delete(id) {
    this.subs.add(this.bd.deleteCat(id).subscribe(x => { }));
    let a = this.categorias.findIndex((element) => element.id == id);
    this.categorias.splice(a, 1);
  }

  changeSize() {
    this.pageSize = parseInt((<HTMLInputElement>document.getElementById('epp')).value);
  }
}
