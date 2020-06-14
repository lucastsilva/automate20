import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { TransferList, Bid } from './Model/modelos.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, interval, Observable } from 'rxjs';
import { Auction, AuctionResponse, ListSearchData, BuyNowPlayerPrices } from './Model/listAuction.model';
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
  positionList = [{
    pos: 'CM-CAM',
    valor: 500
  },
  {
    pos: 'CM-CDM',
    valor: 700
  },
  {
    pos: 'CDM-CM',
    valor: 1000
  },
  {
    pos: 'CAM-CF',
    valor: 2200
  },
  {
    pos: 'CF-CAM',
    valor: 2200
  },
  {
    pos: 'ST-CF',
    valor: 500
  }];
  typeList = ['player', 'position'];
  typeSelected = 'player';

  resultInScreen = '';
  timeInterval$: Observable<number>;
  sub: Subscription;
  sub2: Subscription;

  credits = 0;

  listaJogadoresComprados: string[] = [];
  listBuyNowPrice: number[] = [];
  buyNowPlayerPrices: BuyNowPlayerPrices[] = [];

  searchForm: FormGroup;

  totalInterval = 0;
  tentativas = 0;
  jogadoresComprados = 0;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      sId: new FormControl(''),
      pos: new FormControl(''),
      maxb: new FormControl(0),
      maskedDefId: new FormControl(0),
      leag: new FormControl(0),
      type: new FormControl('player'),
      posList: new FormControl(''),
    });
  }

  AtualizarCredito() {
    console.log(this.searchForm.get('sId').value);
    this.httpService.getCredits(this.searchForm.get('sId').value).subscribe(res => this.credits = res.credits);
  }

  Executar(form) {
    this.tentativas = 0;
    this.jogadoresComprados = 0;
    const intervalo = 15000;
    const timeInterval$ = interval(intervalo);
    this.totalInterval = 0;

    if (form.maxb !== '' && form.pos !== '') {
      console.log('start');
      this.sub = timeInterval$.subscribe(() => {
        if (this.totalInterval <= 600000000) {
          this.totalInterval = this.totalInterval + intervalo;
          this.tentativas++;

          const listSearchData: ListSearchData = {
            sId: form.sId,
            start: 0,
            num: 21,
            type: form.type,
            nat: 0,
            cat: '',
            maskedDefId: form.maskedDefId,
            lev: '',
            leag: form.leag,
            pos: form.pos.toUpperCase(),
            micr: 0,
            macr: 0,
            minb: 0,
            maxb: form.maxb
          };

          this.httpService
            .getTransferList(listSearchData).subscribe(
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
                this.pausarConsumables();
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

  SearchConsumables() {
    const listSearchData: ListSearchData = {
      sId: this.searchForm.value.sId,
      start: 0,
      num: 21,
      type: 'training',
      nat: 0,
      cat: 'position',
      maskedDefId: this.searchForm.value.maskedDefId,
      lev: 'gold',
      leag: this.searchForm.value.leag,
      pos: this.searchForm.value.pos.toUpperCase(),
      micr: 0,
      macr: 0,
      minb: 0,
      maxb: this.searchForm.value.maxb
    };

    const intervalo = 5000;
    const timeInterval$ = interval(intervalo);
    this.sub2 = timeInterval$.subscribe(() => {
      this.httpService
      .getTransferList(listSearchData).subscribe(
        (res: TransferList) => {
          this.httpService.pinEvents(this.searchForm.value.sId).subscribe();
          if (res.auctionInfo === []) {
            this.resultInScreen = 'Nenhum resultado encontrado';
          }

          this.ComprarJogadores(this.searchForm.value.sId, res);
          this.resultInScreen = JSON.stringify(res);
        },
        err => {
          this.resultInScreen = err;
          this.pausar();
          console.log('finish');
        });
    });
    return;
  }

  ConsultaGenerica(form) {

    const listSearchData: ListSearchData = {
      sId: form.sId,
      start: 0,
      num: 21,
      type: form.type,
      nat: 0,
      cat: '',
      maskedDefId: form.maskedDefId,
      lev: '',
      leag: form.leag,
      pos: form.pos.toUpperCase(),
      micr: 0,
      macr: 0,
      minb: 0,
      maxb: form.maxb
    };

    // Consulta genérica, de todos os jogadores
    this.PesquisarJogadores(listSearchData).then((genericSearch: TransferList) => {
      genericSearch.auctionInfo.forEach(search => {
          listSearchData.maskedDefId = search.itemData.id;

          // Consulta por jogador
          this.httpService.comparePrice(form.sId, 0, search.itemData.resourceId)
          .subscribe((playerSearch: TransferList) => {
            playerSearch.auctionInfo.forEach(player => {
              this.listBuyNowPrice.push(player.buyNowPrice);
            });
          });

          // Passa a página para pegar dados do buyNow
          this.httpService.comparePrice(form.sId, 20, search.itemData.resourceId)
          .subscribe((playerSearch: TransferList) => {
            playerSearch.auctionInfo.forEach(player => {
              this.listBuyNowPrice.push(player.buyNowPrice);
            });
          });

          // Passa mais uma vez a página para pegar dados do buyNow
          this.httpService.comparePrice(form.sId, 40, search.itemData.resourceId)
          .subscribe((playerSearch: TransferList) => {
            playerSearch.auctionInfo.forEach(player => {
              this.listBuyNowPrice.push(player.buyNowPrice);
            });
          });
        });
    }).catch(err => {

    }).finally(() => {
        // Agrupar o array e preços
        for (const bnp of this.listBuyNowPrice) {
          let entryFound = false;

          for (const item of this.buyNowPlayerPrices) {
            if (item.valor === bnp) {
              item.qtd++;
              entryFound = true;
              break;
            } else {
              this.buyNowPlayerPrices.push({
                valor: bnp,
                qtd: 1
              });
            }
          }
        }
        console.log(this.buyNowPlayerPrices);
    });
  }

  PesquisarJogadores(listSearchData: ListSearchData): Promise<TransferList> {
    return new Promise(resolve => {
      this.httpService
      .getTransferList(listSearchData)
      .subscribe(
        (res: TransferList) => {
          this.httpService.pinEvents(listSearchData.sId).subscribe();
          if (res.auctionInfo === []) {
            this.resultInScreen = 'Nenhum resultado encontrado';
          }
          resolve(res);
        },
        err => {
          this.resultInScreen = err;
          this.pausar();
          console.log('finish');
        }
      );
    });
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
          },
          err => {
            this.resultInScreen = err;
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
    this.totalInterval = 600000000;
    console.log('finish');
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  pausarConsumables() {
    this.totalInterval = 600000000;
    console.log('finish');
    if (this.sub2 !== undefined) {
      this.sub2.unsubscribe();
    }
  }

  ngOnDestroy() {
    console.log('finish');
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
    if (this.sub2 !== undefined) {
      this.sub2.unsubscribe();
    }
  }

  onChangeType(event) {
    this.typeSelected = event.target.value;
  }

  onChangeSetMaxBuyValue(event) {
    console.log(event);
    this.searchForm.patchValue({
      pos: event.target.value,
      maxb: this.positionList.filter(p => p.pos === event.target.value)[0].valor
    });
  }
}
