import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {environment} from 'environments/environment';

import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProveedoresService {

    coleccion = environment.firebaseConfig.collectProveedores;
    
    constructor(private firestore: AngularFirestore) {}

    public listarProveedores(): Observable<any> {
        return this.firestore
            .collection(this.coleccion, (ref) =>
                ref.where('status', '==', true)
            )
            .snapshotChanges();
    }

    public crea_Proveedor(datos: any): Promise<any> {
        return this.firestore.collection(this.coleccion).add(datos);
    }

    public editar_Proveedor(id: string, datos: any) {
        return this.firestore.collection(this.coleccion).doc(id).update(datos);
    }
}
