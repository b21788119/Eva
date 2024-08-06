const Sequelize = require('sequelize');
const db = require('../util/database');

const Portfolio = db.define('portfolio', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: db.models.user, // Use the User model instance instead of the string "user"
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

// Create a one-to-one association between User and Portfolio
db.models.user.hasOne(Portfolio, { foreignKey: 'userId' });
Portfolio.belongsTo(db.models.user, { foreignKey: 'userId' });

module.exports = Portfolio;