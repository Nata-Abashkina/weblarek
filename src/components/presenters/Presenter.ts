import { IEvents } from '../base/Events';
import { ApiClient } from '../sevices/ApiClient';
import { CDN_URL } from '../../utils/constants';
import { CardGallery } from '../View/cards/CardGallery';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { Gallery } from '../View/Gallery';
import { Catalog } from '../models/Catalog';
import { Buyer } from '../models/Buyer';
import { Modal } from '../View/Modal';
import { Basket } from '../models/Basket';
import { CardFull } from '../View/cards/CardFull';
import { BasketView } from '../View/BasketView';
import { CardBasket } from '../View/cards/CardBasket';
import { FormAddPayment } from '../View/forms/FormAddPayment';
import { FormEmTel } from '../View/forms/FormEmTel';

export class Presenter {
  private orderForm?: FormAddPayment;
  private contactsForm?: FormEmTel;

  constructor(
    private apiClient: ApiClient,
    private events: IEvents,
    private gallery: Gallery,
    private templateSelector: string = '#card-catalog',
    private cdnUrl: string = '',
    private basketModel: Basket,
    private productsModel: Catalog,
    private buyerModel: Buyer,
    private modal: Modal
  ) {

    events.on('modal:close', () => modal.close());

    events.on('card:select', (item) => {
      const product = item as IProduct;
      this.productsModel.setProduct(product);
    
      const cardElement = cloneTemplate<HTMLElement>('#card-preview');
      
      const cardFull = new CardFull(cardElement, {
        onClick: () => {
          if (this.basketModel.hasProduct(product.id)) {
            this.basketModel.delProduct(product);
          } else {
            this.basketModel.addProduct(product);
          }

          cardFull.render({ inBasket: this.basketModel.hasProduct(product.id) });
        }
      });
    
      modal.render({
        content: cardFull.render({
          title: product.title,
          category: product.category,
          price: product.price,
          image: CDN_URL + product.image,
          description: product.description,
          inBasket: this.basketModel.hasProduct(product.id)
        })
      });
    
      modal.open();
    });

    events.on('basket:open', () => {
      const basketElement = cloneTemplate<HTMLElement>('#basket');
      const basketView = new BasketView(basketElement, events);

      const basketItems = this.basketModel.getProducts().map((product, index) => {
        const cardBasketElement = cloneTemplate<HTMLElement>('#card-basket');
        const cardBasket = new CardBasket(cardBasketElement, {
          onClick: () => {
            this.basketModel.delProduct(product);
            events.emit('basket:open');
          }
        })

        return cardBasket.render({
          title: product.title,
          price: product.price,
          index: index + 1
        });
      });
  
      modal.render({
        content: basketView.render({
          items: basketItems,
          total: this.basketModel.getPriceBasket()
        })
      });

      modal.open();
    });

    events.on('order:open', () => {
      this.buyerModel.delBuyer();
      
      const orderElement = cloneTemplate<HTMLElement>('#order');
      this.orderForm = new FormAddPayment(orderElement as HTMLFormElement, events);

      modal.render({
        content: this.orderForm.render({
          valid: false,
          errors: ''
        })
      });
    });

    events.on(/^order\..*:change/, (data: { key: string, value: string }) => {
      this.buyerModel.updBuyer({ [data.key]: data.value });

      if (data.key === 'payment' && this.orderForm) {
        this.orderForm.payment = data.value;
      }

      const errors = this.buyerModel.validBuyer();
      const hasErrors = Boolean(errors.payment || errors.address);

      if (this.orderForm) {
        if (hasErrors) {
          this.orderForm.valid = false;
          this.orderForm.errors = errors.payment || errors.address || '';
        } else {
          this.orderForm.valid = true;
          this.orderForm.errors = '';
        }
      };
    });

    events.on('order:submit', () => {
      console.log('Первая форма заполнена, переходим к контактам!');
      const contactsElement = cloneTemplate<HTMLElement>('#contacts');
      this.contactsForm = new FormEmTel(contactsElement as HTMLFormElement, events);

      const errors = this.buyerModel.validBuyer();

      modal.render({
        content: this.contactsForm.render({
          valid: false,
          errors: errors.email || errors.phone || ''
        })
      });

    });

    events.on(/^contacts\..*:change/, (data: { key:string, value: string }) => {
      this.buyerModel.updBuyer({ [data.key]: data.value });

      const errors = this.buyerModel.validBuyer();
      const hasErrors = Boolean(errors.email || errors.phone);

      if (this.contactsForm) {
        if (hasErrors) {
          this.contactsForm.valid = false;
          this.contactsForm.errors = errors.email || errors.phone || '';
        } else {
          this.contactsForm.valid = true;
          this.contactsForm.errors = '';
        }
      }
    });

    events.on('contacts:submit', async () => {
      try {
        const orderData = {
          payment: this.buyerModel.getBuyer().payment,
          address: this.buyerModel.getBuyer().address,
          email: this.buyerModel.getBuyer().email,
          phone: this.buyerModel.getBuyer().phone,
          total: this.basketModel.getPriceBasket(),
          items: this.basketModel.getProducts().map(product => product.id)
        };
        const result = await this.apiClient.postOrder(orderData);

        this.basketModel.delBasket();

        const succesElement = cloneTemplate<HTMLElement>('#success');
        const resultElement = ensureElement<HTMLElement>('.order-success__description', succesElement);
        resultElement.textContent = `Списано ${result.total} синапсов`;

        const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', succesElement);
        closeButton.addEventListener('click', () => {
          this.modal.close()
        });

        this.modal.render({ content: succesElement });
      } catch (error) {
        console.error(`Ошибка отправки: ${error}`);
        if (this.contactsForm) {
          this.contactsForm.errors = 'Не удалось отправить заказ. Попробуйте позже.';
        }
      }
    });
  }

  async init(): Promise<void> {
    try {
      const response = await this.apiClient.getProducts();
  
      if (!Array.isArray(response.items)) {
        throw new Error('API вернул неожиданный формат: поле items не является массивом');
      }

      const cardElements = response.items.map((product: IProduct) => {
        const cardElement = cloneTemplate<HTMLElement>(this.templateSelector);
        const card = new CardGallery(cardElement, {
          onClick: () => this.handleCardOpen(product)
        });

        return card.render({
          title: product.title,
          image: this.cdnUrl + product.image,
          category: product.category,
          price: product.price
        });
      });

      this.gallery.render({ items: cardElements });
  
    } catch (error) {
      console.error('[GalleryPresenter] Ошибка загрузки галереи:', error);
      this.gallery.render({ items: [] }); 
    }
  }

  handleCardOpen(item: IProduct): void {
    console.log('[GalleryPresenter] Открываем карточку:', item);
    this.events.emit('card:select', item);
  }
}
