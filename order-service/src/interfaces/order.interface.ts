export enum Status {Created, Confirmed, Delivered, Canceled };

export class Order {
  protected _status: Status;

  constructor(readonly id: number, status: Status, readonly createdAt: string) {
    this._status = status;
  }
  
  set status(status: Status) {
    this._status = status;;
  }

  get status() {
    return this._status;
  }
}