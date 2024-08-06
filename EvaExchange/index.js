const express = require('express');
const bodyparser = require('body-parser');
const db = require('./util/database');
const User = require('./models/user');
const Portfolio = require('./models/portfolio');
const PortfolioShare = require('./models/portfolioShare');
const Share = require('./models/share');
const Transaction = require('./models/transaction');
const userRoutes = require('./routes/users');
const portfoliShareRoutes = require('./routes/portfolioShares');
const portfolioRoutes = require('./routes/portfolios');
const shareRoutes = require('./routes/shares');
const transactionRoutes = require('./routes/transactions');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//test route
app.get('/', (req, res, next) => {
  res.send('Hello World');
});

//CRUD routes
app.use('/users', userRoutes);
app.use('/portfolios', portfolioRoutes);
app.use('/shares', shareRoutes);
app.use('/transactions', transactionRoutes);


//error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});


// Initialize Sequelize and start the server
db
  .sync({ force: true })
  .then(async () => {
    console.log("Database synced successfully");
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
     // Create 5 users
     const users = await User.bulkCreate([
      { name: 'Jack Sparrow', email: 'jack@gmail.com' },
      { name: 'Davy Jones', email: 'davy@gmail.com' },
      { name: 'Will Turner', email: 'will@gmail.com' },
      { name: 'Elizabeth Swann', email: 'elizabeth@gmail.com' },
      { name: 'Barbossa', email: 'barbossa@gmail.com' },
    ]);

    // Create 5 portfolios for each user
    const portfolios = await Promise.all(users.map(user => {
      return Portfolio.create({
        userId: user.id,
      });
    }));

    // Create 10 shares
    const shares = await Share.bulkCreate([
      { symbol: 'AAP', currentRate: 100.00,lastRate:86.95 },
      { symbol: 'GOO', currentRate: 200.00, lastRate:82.95},
      { symbol: 'AMZ', currentRate: 300.00 , lastRate:386.95},
      { symbol: 'FBT', currentRate: 400.00 , lastRate:8.95},
      { symbol: 'MSF', currentRate: 500.00 , lastRate:12.95},
      { symbol: 'INT', currentRate: 60.50 , lastRate:90.95},
      { symbol: 'CIS', currentRate: 70.25 , lastRate:1123.95},
      { symbol: 'ORC', currentRate: 80.75 , lastRate:89.95},
      { symbol: 'IBM', currentRate: 90.00 , lastRate:88.95},
      { symbol: 'HPQ', currentRate: 100.50 , lastRate:105.15},
    ]);

    // Create 5 portfolio shares for each portfolio
    await Promise.all(portfolios.map(portfolio => {
      return Promise.all(shares.slice(0, 5).map(share => {
        return PortfolioShare.create({
          portfolioId: portfolio.id,
          shareSymbol: share.symbol,
          quantity: 10,
        });
      }));
    }));

    // Create 5 transactions for each portfolio share
    await Promise.all(portfolios.map(portfolio => {
      return Promise.all(shares.slice(0, 5).map(share => {
        return Transaction.create({
          portfolioId: portfolio.id,
          shareSymbol: share.symbol,
          buyOrSell: 'BUY',
          quantity: 10,
          price: 100.00,
        });
      }));
    }));


  })
  .catch((error) => {
    console.error("Error syncing database:", error);
    process.exit(1);
  });