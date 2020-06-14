import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TransferList, Bid } from './Model/modelos.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, interval, Observable } from 'rxjs';
import { Auction, AuctionResponse } from './Model/listAuction.model';
import { map } from 'rxjs/operators';
import { NumberSymbol } from '@angular/common';
import { Item } from './Model/item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'automate';
  start = 0;
  num = 21;
  type = 'player';
  nat = 0;
  maskedDefId = 0;
  pos = '';
  micr = 0; // MIN BID
  macr = 0; // MAX BID
  minb = 0; // MIN BUY NOW
  maxb = 0; // MAX BUY NOW
  resultInScreen = '';
  timeInterval$: Observable<number>;
  sub: Subscription;

  credits = 0;

  listaJogadoresComprados: string[] = [];

  searchForm: FormGroup;

  totalInterval = 0;
  tentativas = 0;
  jogadoresComprados = 0;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      sId: new FormControl(''),
      pos: new FormControl(''),
      maxb: new FormControl(''),
      maskedDefId: new FormControl('')
    });
  }

  AtualizarCredito() {
    console.log(this.searchForm.get('sId').value);
    this.httpService.getCredits(this.searchForm.get('sId').value).subscribe(res => this.credits = res.credits);
  }

  Executar(form) {
    this.tentativas = 0;
    this.jogadoresComprados = 0;
    const intervalo = 5000;
    const timeInterval$ = interval(intervalo);
    this.totalInterval = 0;

    if (form.maxb !== '' && form.pos !== '') {
      console.log('start');
      this.sub = timeInterval$.subscribe(() => {
        if (this.totalInterval <= 6000000) {
          this.totalInterval = this.totalInterval + intervalo;
          this.tentativas++;
          this.httpService
            .getTransferList(form.sId, this.start, this.num, this.type, this.nat, form.maskedDefId, form.pos.toUpperCase(), this.micr,
              this.macr, this.minb, form.maxb)
            .subscribe(
              (res: TransferList) => {
                this.httpService.pinEvents(form.sId).subscribe();
                if (res.auctionInfo === []) {
                  this.resultInScreen = 'Nenhum resultado encontrado';
                }
                this.ComprarJogadores(form.sId, res);
                this.resultInScreen = JSON.stringify(res);
              },
              err => {
                this.resultInScreen = err;
                this.pausar();
                console.log('finish');
              }
            );
        } else {
          this.ngOnDestroy();
        }
      });
      return;
    }
    this.resultInScreen = 'Preencha todos os campos';
  }

  ComprarJogadores(sId: string, transferList: TransferList) {
    transferList.auctionInfo.forEach(p => {
      if (this.listaJogadoresComprados.length !== undefined && !this.listaJogadoresComprados.includes(p.itemData.id)) {
        this.httpService
          .bid(sId, p.tradeId, p.buyNowPrice)
          .subscribe((res: Bid) => {
              if (res.auctionInfo[0].bidState === 'buyNow') {
                this.jogadoresComprados++;
                this.listaJogadoresComprados.push(res.auctionInfo[0].itemData.id);
                this.AtualizarCredito();
                this.ListarJogador(sId, res);
              }
          });
      }
    });
  }

  async ListarJogador(sId: string, bid: Bid) {
    let startPrice = 0;
    let finalPrice  = 0;
    this.multiplo50(bid.auctionInfo[0].buyNowPrice * 1.06).then((res) => {
      startPrice = res;
    });
    this.multiplo50(bid.auctionInfo[0].buyNowPrice * 1.35).then((res) => {
      finalPrice = res;
    });

    this.httpService.item(sId, bid.auctionInfo[0].itemData.id)
    .subscribe((resi: Item) => {
      // if (resi.itemData[0].success) {

      //   const auction: Auction = {
      //     itemData: {
      //       id: bid.auctionInfo[0].itemData.id
      //     },
      //     startingBid: startPrice,
      //     duration: 3600,
      //     buyNowPrice: finalPrice
      //   };

      //   this.httpService
      //     .listItem(sId, auction)
      //     .subscribe((auctionResponse: AuctionResponse) => {
      //       if (auctionResponse.id !== 0) {
      //         this.resultInScreen = `tradeId = ${auctionResponse.id}`;
      //       }
      //     });
      // }
    });
  }

  multiplo50(num: number): Promise<number> {
    num = Math.ceil(num);
    console.log(num);
    if (num > 50000) {
      if (num % 500 === 0) {
         this.increaseNumber(num, 500).then(res => num = res);
      }
    }

    if (num > 10000) {
      if (num % 250 === 0) {
         this.increaseNumber(num, 250).then(res => num = res);
      }
    }

    if (num > 1000) {
      if (num % 100 === 0) {
        this.increaseNumber(num, 100).then(res => num = res);
      }
    }

    // Se nr for menor que 1000, múltiplo de 50
    if (num < 1000) {
      if (num % 50 !== 0) {
        this.increaseNumber(num, 50).then(res => num = res);
      }
    }

    return new Promise(resolve => {
      resolve(num);
    });
  }

  increaseNumber(num: number, modulo: number): Promise<number> {
    while (num % modulo !== 0) {
      num++;
    }
    console.log('increaseNumber:' + num);

    return new Promise(resolve => {
      resolve(num);
    });
  }

  pausar() {
    this.totalInterval = 6000000;
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    console.log('finish');
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}
