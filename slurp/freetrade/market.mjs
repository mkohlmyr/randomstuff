import stocks from './stocks';

const market = {

};

stocks.forEach((stock) => {
  market[stock.id] = {
    price: stock.initialPrice,
    ticker: stock.ticker,
  };
});

export default {
  getSharePrice(stockId) {
    return market[stockId].price;
  },
  setSharePrice(stockId, newPrice) {
    market[stockId].price = newPrice;
  },
  getSharePriceByTicker(ticker) {
    return Object.values(market).find((stock) => {
      return stock.ticker === ticker;
    }).price;
  },
  setSharePriceByTicker(ticker, newPrice) {
    Object.values(market).find((stock) => {
      return stock.ticker === ticker;
    }).price = newPrice;
  }
}