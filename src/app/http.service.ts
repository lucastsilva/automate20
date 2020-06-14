import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { TransferList, Bid } from './Model/modelos.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Auction, AuctionResponse, ListSearchData } from './Model/listAuction.model';
import { PinEventResponse, PinEvent } from './Model/pinEvent.model';
import { Item } from './Model/item.model';
import { Credits } from './Model/credits.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  urlFixa = 'https://utas.external.s2.fut.ea.com/ut/game/fifa20/';

  getCredits(sID: string): Observable<Credits> {
    const url = `${this.urlFixa}user/credits`;

    const httpOptions = {
      headers: new HttpHeaders({
        'X-UT-SID': sID
      })
    };

    // now returns an Observable of Config
    return this.http
      .get<Credits>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getTransferList(listSearchData: ListSearchData): Observable<TransferList> {
    const url = this.montarUrl(
      listSearchData.start,
      listSearchData.num,
      listSearchData.type,
      listSearchData.nat,
      listSearchData.cat,
      listSearchData.maskedDefId,
      listSearchData.lev,
      listSearchData.leag,
      listSearchData.pos,
      listSearchData.micr,
      listSearchData.macr,
      listSearchData.minb,
      listSearchData.maxb
    );

    const httpOptions = {
      headers: new HttpHeaders({
        'X-UT-SID': listSearchData.sId
      })
    };

    // now returns an Observable of Config
    return this.http
      .get<TransferList>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  comparePrice(sId: string, start: number, definitionId: number): Observable<TransferList> {
    const url = `${this.urlFixa}transfermarket?start=${start}&num=21&type=player&definitionId=${definitionId}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'X-UT-SID': sId
      })
    };

    // now returns an Observable of Config
    return this.http
      .get<TransferList>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // getTransferList(
  //   sID: string,
  //   start: number,
  //   num: number,
  //   type: string,
  //   nat: number,
  //   maskedDefId: number,
  //   pos: string,
  //   micr: number,
  //   macr: number,
  //   minb: number,
  //   maxb: number
  // ): Observable<TransferList> {
  //   const url = this.montarUrl(
  //     start,
  //     num,
  //     type,
  //     nat,
  //     maskedDefId,
  //     pos,
  //     micr,
  //     macr,
  //     minb,
  //     maxb
  //   );

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'X-UT-SID': sID
  //     })
  //   };

  //   // now returns an Observable of Config
  //   return this.http
  //     .get<TransferList>(url, httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  private montarUrl(
    start: number,
    num: number,
    type: string,
    nat: number,
    cat: string,
    maskedDefId: number,
    lev: string,
    leag: number,
    pos: string,
    micr: number,
    macr: number,
    minb: number,
    maxb: number
  ) {
    let urlProvisoria = '';
    urlProvisoria = urlProvisoria + `start=${start}&`;

    if (num !== 0) {
      urlProvisoria = urlProvisoria + `num=${num}&`;
    }

    if (type !== '') {
      urlProvisoria = urlProvisoria + `type=${type}&`;
    }

    if (nat !== 0) {
      urlProvisoria = urlProvisoria + `nat=${nat}&`;
    }

    if (cat !== '') {
      urlProvisoria = urlProvisoria + `cat=${cat}&`;
    }

    if (maskedDefId !== 0) {
      urlProvisoria = urlProvisoria + `maskedDefId=${maskedDefId}&`;
    }

    if (lev !== '') {
      urlProvisoria = urlProvisoria + `lev=${lev}&`;
    }

    if (leag !== 0) {
      urlProvisoria = urlProvisoria + `leag=${leag}&`;
    }

    if (pos !== '') {
      urlProvisoria = urlProvisoria + `pos=${pos}&`;
    }

    if (micr !== 0) {
      urlProvisoria = urlProvisoria + `micr=${micr}&`;
    }

    if (macr !== 0) {
      urlProvisoria = urlProvisoria + `macr=${macr}&`;
    }

    if (minb !== 0) {
      urlProvisoria = urlProvisoria + `minb=${minb}&`;
    }

    if (maxb !== 0) {
      urlProvisoria = urlProvisoria + `maxb=${maxb}&`;
    }

    urlProvisoria = urlProvisoria.substring(0, urlProvisoria.length - 1);

    return `${this.urlFixa}transfermarket?${urlProvisoria}`;
  }

  bid(sID: string, tradeId: number, bidValue: number): Observable<Bid> {

    const url = `${this.urlFixa}trade/${tradeId}/bid`;
    const body = { bid: bidValue };

    const httpOptions = {
      headers: new HttpHeaders({
        'X-UT-SID': sID
      })
    };

    // now returns an Observable of Config
    return this.http
      .put<Bid>(url, body, httpOptions)
      .pipe(catchError(this.handleError));
  }

  item(sID: string, itemId: string): Observable<Item> {
    const url = `${this.urlFixa}item`;
    const body = {itemData: [{id: itemId, pile: 'trade'}]};

    const httpOptions = {
      headers: new HttpHeaders({
        'X-UT-SID': sID
      })
    };

    // now returns an Observable of Config
    return this.http
      .put<Item>(url, body, httpOptions)
      .pipe(catchError(this.handleError));
  }

  listItem(sID: string, auction: Auction): Observable<AuctionResponse> {

    const url = `${this.urlFixa}auctionhouse`;

    const httpOptions = {
      headers: new HttpHeaders({
        'X-UT-SID': sID
      })
    };

    // now returns an Observable of Config
    return this.http
      .post<AuctionResponse>(url, auction, httpOptions)
      .pipe(catchError(this.handleError));
  }

  pinEvents(sID: string): Observable<PinEventResponse> {
    const url = `https://pin-river.data.ea.com/pinEvents`;

    const httpOptions = {
      headers: new HttpHeaders({
        'x-ea-game-id': 'FUT20WEB',
        'x-ea-game-id-type': 'easku',
        'x-ea-taxv': '1.1',
      })
    };

    const data = new Date();
    data.toLocaleString('en-US', { timeZone: 'America/New_York' });

    const pinEvent: PinEvent = {
      custom: {
        networkAccess: 'G',
        service_plat: 'ps4'
      },
      et: 'client',
      events: [
        {
          type: 'menu',
          pgid: 'Transfer Market Results - List View',
          core: {
            s: 55,
            pidt: 'persona',
            pid: '876772140',
            ts_event: data,
            en: 'page_view',
            pidm: {
              nucleus: 2851253396
            }
          }
        }
      ],
      gid: 0,
      is_sess: true,
      loc: 'en_US',
      plat: 'web',
      rel: 'prod',
      taxv: '1.1',
      tid: 'FUT20WEB',
      tidt: 'easku',
      ts_post: data,
      v: '20.5.0',
      sid: sID
    };

    // now returns an Observable of Config
    return this.http
      .post<PinEventResponse>(url, pinEvent, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
