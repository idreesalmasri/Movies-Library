`use strict`;
const express = require('express');
const app = express();
const data = require('./data.json');
const axios= require('axios');
const dotenv=require('dotenv');
dotenv.config();
app.use(express.json());
const APIKEY=process.env.APIKEY;
const pg =require("pg");
const DATABASE_URL=process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// new comment

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
    })
    .catch(function (error) {
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
    })
    .catch(function (error) {
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
    })
    .catch(function (error) {
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


  function addmovie(req,res){
    console.log(req.body);
    let newMovie=req.body;
    const sql =`INSERT INTO myFavorite (title,release_date,poster_path,overview,comment)values($1,$2,$3,$4,$5) RETURNING *;`
    let values=[newMovie.title,newMovie.release_date,newMovie.poster_path,newMovie.overview,newMovie.comment];
    client.query(sql,values).then((data)=>{
      return res.status(201).json(data.rows[0]);
    })
    .catch(function (error) {
      console.log(error);
      res.sendStatus(500).send("error: " + error)
  });
  }


  function getallmovie(req,res){
    const sql =`SELECT * FROM myFavorite`;
    client.query(sql).then(data=>{
      return res.status(200).json(data.rows);
    })
    .catch(function (error) {
      console.log(error);
      res.sendStatus(500).send("error: " + error)
  });
  }


function getSpecificMovie(req,res){
  const id=req.params.id;
  const sql =`SELECT * FROM myFavorite WHERE id=${id}`;
  client.query(sql).then(data=>{
    res.status(200).json(data.rows);
  })
  .catch(function (error) {
    console.log(error);
    res.sendStatus(500).send("error: " + error)
});
}


function update(req,res){
  const id =req.params.id;
  const movie =req.body;
  const sql =`UPDATE myFavorite SET title=$1,release_date=$2,poster_path=$3,overview=$4,comment=$5 WHERE id=${id} RETURNING *`;
  const values=[movie.title,movie.release_date,movie.poster_path,movie.overview,movie.comment];
  client.query(sql,values).then(data=>{
    res.status(200).json(data.rows);
  })
  .catch(function (error) {
    console.log(error);
    res.sendStatus(500).send("error: " + error)
});
}


function deleteMovie(req,res){
  const id =req.params.id;
  const sql=`DELETE FROM myFavorite WHERE id=${id}`;
  client.query(sql).then(()=>{
    return res.status(204).json([]);
  })
  .catch(function (error) {
    console.log(error);
    res.sendStatus(500).send("error: " + error)
});
}  




app.get("/", homePage);
app.get("/favorite", favorite);
app.get("/trending", trending);
app.get("/search", search);
app.get("/movie/now_playing", nowPlaying);
app.post("/addmovie",addmovie);
app.get("/getallmovie",getallmovie)
app.get("/getMovie/:id",getSpecificMovie);
app.put("/UPDATE/:id",update);
app.delete("/DELETE/:id",deleteMovie);



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



client.connect().then (()=>{
app.listen(3120, () => {
    console.log("hello");
});
})