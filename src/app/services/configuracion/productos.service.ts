import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {environment} from 'environments/environment';

import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {
    coleccion = environment.firebaseConfig.collectProductos;

    constructor(private firestore: AngularFirestore) {}

    public listarProductos(): Observable<any> {
        return this.firestore
            .collection(this.coleccion, (ref) =>
                ref.where('status', '==', true)
            )
            .snapshotChanges();
    }

    public crea_Productos(datos: any): Promise<any> {
        return this.firestore.collection(this.coleccion).add(datos);
    }

    public editar_Productos(id: string, datos: any) {
        return this.firestore.collection(this.coleccion).doc(id).update(datos);
    }
}
