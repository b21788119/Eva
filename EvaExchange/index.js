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

    const portfolios = await Promise.all(users.map(user => {
      return Portfolio.create({
        userId: user.id,
        name: 'Share Portfolio'
      },);
    }));

    await Share.bulkCreate([
      { symbol: 'AAP', currentPrice: 123.45 },
      { symbol: 'GOO', currentPrice: 987.65 },
      { symbol: 'MIC', currentPrice: 456.78 },
      { symbol: 'INT', currentPrice: 321.09 },
      { symbol: 'CIS', currentPrice: 654.32 },
      { symbol: 'SUN', currentPrice: 789.01 },
      { symbol: 'ORC', currentPrice: 901.23 },
      { symbol: 'BIN', currentPrice: 234.56 },
      { symbol: 'TEL', currentPrice: 567.89 },
      { symbol: 'NET', currentPrice: 890.12 },
    ]);

     const transactions = [
      { shareSymbol: 'AAP', buyOrSell: 'BUY', quantity: 10, price: 120.45 },
      { shareSymbol: 'AAP', buyOrSell: 'SELL', quantity: 5, price: 155.45 },
      { shareSymbol: 'MIC', buyOrSell: 'BUY', quantity: 100, price: 430.78 },
      { shareSymbol: 'MIC', buyOrSell: 'SELL', quantity: 15, price: 420.00 },
      { shareSymbol: 'INT', buyOrSell: 'BUY', quantity: 1230, price: 250.78 },
      { shareSymbol: 'INT', buyOrSell: 'BUY', quantity: 1000, price: 305.12 },
    ];


    // Create 5 portfolio shares for each portfolio
    await Promise.all(portfolios.map(async portfolio => {
      for (const transaction of transactions) {
        const newTransaction = await Transaction.create({
          portfolioId: portfolio.id,
          shareSymbol: transaction.shareSymbol,
          buyOrSell: transaction.buyOrSell,
          quantity: transaction.quantity,
          price: transaction.price,
        });
        console.log(`Transaction created: ${transaction.buyOrSell} ${transaction.quantity} shares of ${transaction.shareSymbol} in portfolio ${portfolio.id} by user with id : ${portfolio.userId}`);
        console.log(`Transaction details: ${JSON.stringify(newTransaction)}`);

      }
      
    }));
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
    process.exit(1);
  });