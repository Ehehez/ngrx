import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { AccesoBDService } from 'src/app/services/acceso-bd.service';
import { FormGroup, FormControl } from '@angular/forms';
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
      console.log(a);
      this.catPadre = [];
      this.catPadre.unshift({ id: "", Name: "" });
      this.categorias = a;
      this.size = this.categorias.length;

      this.categorias.forEach((x) => {
        if (x.CategoriaPadre == null) {
          this.catPadre.push(x);
        }
      });
    }));

    this.form = new FormGroup({
      Name: new FormControl(''),
      CategoriaPadre: new FormControl(''),
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
    console.log(this.form.value);
    let a = this.categorias.findIndex((x) => x.Name == this.form.value.Name);
    this.subs.add(this.bd.setCategoria(this.form.value, this.categorias[a].id).subscribe((x) => console.log(x)));


    this.categorias[a].Name = this.form.value.Name;
    this.categorias[a].CategoriaPadre = this.form.value.CategoriaPadre;

    this.modalService.dismissAll();

  }

  open(content, id) {
    this.modalService.open(content);
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
}
