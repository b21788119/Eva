const Share = require('../models/share');

// Get all shares
exports.getShares = (req, res, next) => {
  Share.findAll()
    .then(shares => {
      res.status(200).json({ shares: shares });
    })
    .catch(err => console.log(err));
}

// Get share by symbol
exports.getShare = (req, res, next) => {
  const symbol = req.params.symbol;
  Share.findByPk(symbol)
    .then(share => {
      if (!share) {
        return res.status(404).json({ message: 'Share not found!' });
      }
      res.status(200).json({ share: share });
    })
    .catch(err => console.log(err));
}

// Create share
exports.createShare = (req, res, next) => {
  const symbol = req.body.symbol;
  const rate = req.body.rate;
  Share.create({
    symbol: symbol,
    rate: rate
  })
    .then(result => {
      console.log('Created Share');
      res.status(201).json({
        message: 'Share created successfully!',
        share: result
      });
    })
    .catch(err => {
      console.log(err);
    });
}

// Update share
exports.updateShare = (req, res, next) => {
  const symbol = req.params.symbol;
  const updatedRate = req.body.rate;
  Share.findByPk(symbol)
    .then(share => {
      if (!share) {
        return res.status(404).json({ message: 'Share not found!' });
      }
      share.currentRate = updatedRate;
      return share.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Share updated!', share: result });
    })
    .catch(err => console.log(err));
}

// Delete share
exports.deleteShare = (req, res, next) => {
  const symbol = req.params.symbol;
  Share.findByPk(symbol)
    .then(share => {
      if (!share) {
        return res.status(404).json({ message: 'Share not found!' });
      }
      return Share.destroy({
        where: {
          symbol: symbol
        }
      });
    })
    .then(result => {
      res.status(200).json({ message: 'Share deleted!' });
    })
    .catch(err => console.log(err));
}