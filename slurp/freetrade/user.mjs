import market from './market';
const EventType = {
  Buy: 1,
  Sell: 2,
};

export class User {
  constructor() {
    this.wallet = 0;
    this.events = [];
  }

  withdraw(quantity) {
    this.wallet -= quantity;
  }

  deposit(quantity) {
    this.wallet += quantity;
  }

  buy(stockId, quantity) {
    this.events.push(
      {
        type: EventType.Buy,
        stockId,
        quantity,
        timestamp: Date.now(),
      }
    );

    this.wallet -= market.getSharePrice(stockId) * quantity;
  }

  sell(stockId, quantity) {
    this.events.push(
      {
        type: EventType.Sell,
        stockId,
        quantity,
        timestamp: Date.now(),
      }
    );
    this.wallet += market.getSharePrice(stockId) * quantity;
  }

  value(timestamp) {
    return this.events.reduce((acc, event) => {
      if (event.timestamp > timestamp) {
        return acc;
      } else if (event.type === EventType.Buy) {
        return acc + event.quantity * market.getSharePrice(event.stockId);
      } else {
        return acc - event.quantity * market.getSharePrice(event.stockId);
      }
    }, 0) + this.wallet;
  }
}