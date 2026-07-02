import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IFormState {
  valid: boolean,
  errors: string
}

export class Form<T> extends Component<IFormState>{
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const formName = (this.container as HTMLFormElement).name;

      this.events.emit(`${formName}.${String(target.name)}:change`, {
        key: target.name,
        value: target.value
      })
    })

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      const formName = (this.container as HTMLFormElement).name;
      this.events.emit(`${formName}:submit`);
    })

    
  }

  set valid(value: boolean) {
    if (value) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}