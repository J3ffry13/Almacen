import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {environment} from 'environments/environment';

import {Observable, map} from 'rxjs';

interface Combo {
    id: string;
    nombre: string;
}

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    coleccion = environment.firebaseConfig.collectListCombos;

    constructor(private firestore: AngularFirestore) {}

    listarCombos$(tipoDesc: string): Observable<any[]> {
        return this.firestore
            .collection(this.coleccion, (ref) =>
                ref.where('desc', '==', tipoDesc)
            )
            .snapshotChanges()
            .pipe(
                map((result) => {
                    return result.map((element) => ({
                        id: element.payload.doc.data()['id'],
                        nombre: element.payload.doc.data()['nombre']
                    }));
                })
            );
    }
}
