import { Injectable, OnDestroy } from '@angular/core';
import { AccesoBDService } from './acceso-bd.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FichaArticuloService implements OnDestroy {

  subs = new Subscription();

  constructor(private bd: AccesoBDService) { }

  getArticulo(id) {
    return this.subs.add(this.bd.getArticulo(+id).subscribe(x => { }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
