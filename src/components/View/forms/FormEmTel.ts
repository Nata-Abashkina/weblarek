import { IBuyer } from "../../../types";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class FormEmTel extends Form<Pick<IBuyer, 'email' | 'phone'>>{

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
  }
}