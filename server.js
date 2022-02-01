`use strict`;
const express = require('express');
const app = express();
// const data = require('./data.json');
const axios= require('axios');
const dotenv=require('dotenv');
dotenv.config();
const APIKEY=process.env.APIKEY;
function Data(id,title,release_date, poster_path, overview) {
    this.id=id;
    this.title = title;
    this.releaseDate=release_date;
    this.posterPath = poster_path;
    this.overview = overview;
}
function trending(req, res) {
    let trending =[];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US&number=10`).then(value =>{
        // console.log(value.data)
        value.data.results.forEach(result =>{
            let oneResult = new Data(result.id,result.title,result.release_date,result.poster_path,result.overview);
            
            trending.push(oneResult);
            
        })
        // .catch(function (error) {
        //     console.log(error);
        //     res.sendStatus(500).send("error: " + error)
        // });
        return res.status(200).json(trending);
    })
    
}
function search(req, res) {
    let search=[];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=The&page=2`).then(searchValue=>{
    searchValue.data.results.forEach(result =>{
        let searchResult=new Data(result.id,result.title,result.release_date,result.poster_path,result.overview);
        search.push(searchResult);
    })
    // .catch(function (error) {
    //     console.log(error);
    //     res.sendStatus(500).send("error: " + error)
    // });
    return res.status(200).json(search);
    })
}
app.get("/trending", trending);
app.get("/search", search);


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

app.listen(3120, () => {
    console.log("hello");
})