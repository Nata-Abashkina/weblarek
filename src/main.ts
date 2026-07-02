import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants.ts';
import { IApi } from './types/index.ts';
import { Api } from './components/base/Api.ts';

import { Catalog } from './components/models/Catalog.ts';
import { Basket } from './components/models/Basket.ts';
import { Buyer } from './components/models/Buyer.ts';
import { ApiClient } from './components/sevices/ApiClient.ts';

import { Header } from './components/View/Header.ts';
import { Gallery } from './components/View/Gallery.ts';
import { Modal } from './components/View/Modal.ts';


import { ensureElement } from './utils/utils.ts';

import { EventEmitter } from './components/base/Events.ts';

import { Presenter } from './components/presenters/Presenter.ts';

const api: IApi = new Api(API_URL);

async function main() {
  const events = new EventEmitter();
  const apiClient = new ApiClient(api);

  const productsModel = new Catalog([]);
  const basketModel = new Basket(events);
  const buyerModel = new Buyer('', '', '', '');

  const headerContainer = ensureElement<HTMLElement>('.header');
  const header = new Header(events, headerContainer);

  const galleryContainer = ensureElement<HTMLElement>('.gallery');
  const galleryView = new Gallery(galleryContainer);

  const modalContainer = ensureElement<HTMLElement>('.modal');
  const modal = new Modal (modalContainer, events);

  header.render({ counter: basketModel.getCountProducts() });
  events.on('basket:change', () => {
    header.render({ counter: basketModel.getCountProducts() });
  });

  const presenter = new Presenter(apiClient, events, galleryView, '#card-catalog', CDN_URL, basketModel, productsModel, buyerModel, modal);

  await presenter.init();
}

main().catch(console.error);