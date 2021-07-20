const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');
const db = require('./db');

async function initializeDb() {
    Restaurant.hasMany(Menu)
    Menu.belongsTo(Restaurant)
    Menu.hasMany(MenuItem);
    MenuItem.belongsTo(Menu);
    await db.sync();
}

module.exports = initializeDb;