import { User } from './user';
import stocks from './stocks';
import { equal, ok, deepEqual, notDeepEqual, } from 'assert';
import market from './market';

const user1 = new User();
const user2 = new User();


user1.deposit(15000);
user2.deposit(1500);

// Test basic wallet value
// 
equal(user1.wallet, 15000);
equal(user2.wallet, 1500);

user1.buy(1, 3); // 3x amazon

// User 1 buys 3 amaon, 15000 - 1795 * 3
// 
equal(user1.wallet, 9615);
equal(user1.events.length, 1);

// Alter AMZN market value
market.setSharePriceByTicker("AMZN", 1900);

// Sell 3x 1900 = 5700
// Add to wallet of 9615 = 15315
user1.sell(1, 3);
equal(user1.wallet, 15315)
equal(user1.events.length, 2);

// Buy MSFT 5x 115 = 575
user2.buy(3, 5);

// Total portfolio value not changed, 15315
equal(user2.value(), 1500);

market.setSharePriceByTicker("MSFT", 200);

// Value increased by 85 * 5
equal(user2.value(), 1925);