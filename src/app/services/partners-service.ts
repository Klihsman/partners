import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Partners from '../models/partners';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  constructor(public http: HttpClient) {}

  PartnersList(): Observable<HttpResponse<Partners[]>> {
    return this.http.get<Partners[]>(
      ' https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners',
      { observe: 'response' }
    );
  }

  DeletePartners(id: string) {
    return this.http.delete(
      ` https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners/${id}`,
      { observe: 'response' }
    );
  }

  RegisterPartners(Partners: Partners) {
    return this.http.post(
      ` https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners`,
      Partners,
      { observe: 'response' }
    );
  }

  UpdatePartners(Partners: Partners) {
    return this.http.put(
      ` https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners/` +
        Partners.id,
      Partners,
      { observe: 'response' }
    );
  }
}
