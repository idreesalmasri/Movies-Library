`use strict`;
const express = require('express');
const app = express();
const data = require('./data.json');

function Data(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
function homePage(req, res) {
    let newData = new Data(data.title, data.poster_path, data.overview)

    return res.status(200).json(newData);
}
function favorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}
app.get("/", homePage);
app.get("/favorite", favorite);

// app.use(function(err,req,tes,text){
//     console.error(err.stack);
//     res.type('text/plain');
//     res.status(500);
//     res.send('Sorry, something went wrong 500');
// })

// app.use(function(err,req,tes,text){
//     console.error(err.stack);
//     res.type('text/plain');
//     res.status(404);
//     res.send('Sorry, something went wrong 404');
// })

app.listen(3200, () => {
    console.log("hello");
})