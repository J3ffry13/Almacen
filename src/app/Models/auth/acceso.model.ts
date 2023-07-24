export class AccesoModel {

    accesoWebID: number;
    accesoPadreID: number;

    accesoWebTag: string;
    accesoWebDescripcion: string;
    status: boolean;

    clear(): void
    {
        this.accesoWebID = 0;
        this.accesoPadreID = 0;
        this.accesoWebTag = '';
        this.accesoWebDescripcion = '';
        this.status = true;
	}
}
