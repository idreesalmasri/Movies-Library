`use strict`;
const express = require('express');
const app = express();
const data = require('./data.json');
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
        
        return res.status(200).json(trending);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500).send("error: " + error)
  });
    
}
function search(req, res) {
    let searchQuery=req.query.search;
    let search=[];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchQuery}&page=2`).then(searchValue=>{
    searchValue.data.results.forEach(result =>{
        let searchResult=new Data(result.id,result.title,result.release_date,result.poster_path,result.overview);
        search.push(searchResult);
    })
    
    return res.status(200).json(search);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500).send("error: " + error)
  });
}
function nowPlaying(req, res) {
    let trending =[];
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY}&language=en-US&page=1&number=10`).then(value =>{
        // console.log(value.data)
        value.data.results.forEach(result =>{
            let oneResult = new Data(result.id,result.title,result.release_date,result.poster_path,result.overview);
            
            trending.push(oneResult);
            
        })
        
        return res.status(200).json(trending);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500).send("error: " + error)
  });
}
function homePage(req, res) {
    let mydata = new Data(data.title, data.poster_path, data.overview)
    return res.status(200).json(mydata);
  }
  function favorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
  }
app.get("/", homePage);
app.get("/favorite", favorite);
app.get("/trending", trending);
app.get("/search", search);
app.get("/movie/now_playing", nowPlaying);


app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

  app.use(error); 
   function error(error, req, res, next){
     const err={
       status:500,
       message:error.message
     }
     res.status(500).send(err);
   }

app.listen(3120, () => {
    console.log("hello");
})