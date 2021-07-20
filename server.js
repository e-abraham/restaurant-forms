//Express
const express = require('express');
const { check, validationResult } = require("express-validator"); // ??
const app = express();
const port = 3000;

//HB
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

//Models
const Restaurant = require("./models/restaurant");
const Menu = require("./models/menu");
const MenuItem = require("./models/menuItem");
  
//db
const initializeDb = require('./initializeDb');
initializeDb();

//Handlebars Configuration
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

//serve static files
app.use(express.static("public"));
app.use(express.urlencoded()) //so req.body gets exposed to server

//body-parsing
app.use(express.json());

app.get('/web/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants',{restaurants}) //restaurants view + exposing hb module with restaurants
})

app.get('/web/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
        include: {
            model: Menu,
            include: MenuItem
        }
    });
    console.log('MENUS??', restaurant.Menus)
    res.render('restaurant', {restaurant});
})

app.get("/restaurants/:id", async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
        include: {
            model: Menu,
            include: MenuItem,
        },
    });
    res.json(restaurant);
});

app.get("/new-restaurant-form", (req,res) => {
    res.render("newRestaurantForm")
})

//request url must match form action url
app.post("/new-restaurant", async (req,res) => {
    const newRestaurant = await Restaurant.create(req.body);
    console.log("new Restaurant", newRestaurant);
    const foundRestaurant = await Restaurant.findByPk(newRestaurant.id);
    console.log("found Restaurant", foundRestaurant);
    if(foundRestaurant){
        res.status(201).send("New Restaurant successfully created!")
    } else {
        console.error("Restaurant was not created!")
    }
})

app.listen(port, () => {
    console.log(`Your app is now listening to port http://localhost:${port}`);
})