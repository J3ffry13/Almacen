import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {environment} from 'environments/environment';

import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TrabajadorService {
    coleccion = environment.firebaseConfig.collectTrabajadores;

    constructor(private firestore: AngularFirestore) {}

    public listarTrabajador(accion: number, dni: string): Observable<any> {
        return this.firestore
            .collection(this.coleccion, (ref) =>
                ref.where('status', '==', true).where('dni', accion == 0 ? '==' : '!=', dni)
            )
            .snapshotChanges();
    }

    public crea_Trabajador(datos: any): Promise<any> {
        return this.firestore.collection(this.coleccion).add(datos);
    }

    public editar_Trabajador(id: string, datos: any) {
        return this.firestore.collection(this.coleccion).doc(id).update(datos);
    }
}
