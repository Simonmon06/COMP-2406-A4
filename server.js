
const express = require('express')
const logger = require('morgan') //request logger
const app = express()
const API_KEY = '45688aab45af443ced0f72a84c9980aa'
const https = require('https')


const PORT = process.env.PORT || 3000


const ROOT_DIR = '/public'; //root directory for our static pages


function sendResponse(data, res){
// the html part

  var page = '<html><head><title>Assignment 4</title></head>' +
    '<body>' +
    '<form action="/recipes">' +
    'Enter an ingredient: <input id="ingredients" name="ingredients">' +
	'<input type="submit" value="Submit">' +
    '</form><table border="1">'
	//console.log("data:"+data)
	//console.log("ingredient count:"+ JSON.parse(data).count)
  if(data){
	  for(let i = 0; i < JSON.parse(data).count; i++){
		  //three food pictures in a row
		  if(i%3 == 0)page += '<tr>'
		  page += '<td width="250 style="word-wrap: break-word" ><p><a href = "' + JSON.parse(data).recipes[i].f2f_url + 
					'" target="_blank"><img width="250" src = "' + JSON.parse(data).recipes[i].image_url + 
					'" alt = ' + JSON.parse(data).recipes[i].title + '/></a></p>'
		  page += '<p>' + JSON.parse(data).recipes[i].title + '</p></td>'
		  if(i%3 == 2)page += '</tr>'
	  }
	if((JSON.parse(data).count - 1) % 3 != 2 && JSON.parse(data).count > 0)page += '</tr>'
  }
  page += '</table></body></html>' 
//console.log("page:"+page)  
  res.send(page);
  //console.log("out")
}

//parsefood
function parseFood(foodResponse, res) {
  let data = ''
  foodResponse.on('data', function (chunk) {
    data += chunk
  })
  foodResponse.on('end', function () {
    sendResponse(data, res)
  })
}
//get infor from  food2fork
function getFood(ingredients, res){
  const options = {
     host: 'www.food2fork.com',
     path: `/api/search?q=${ingredients}&key=${API_KEY}`
  }
  console.log(options);
  https.request(options, function(apiResponse){
    parseFood(apiResponse, res)
  }).end()
}

//use morgan logger to keep request log files
app.use( logger('dev'))
//Middleware
app.use(function(req, res, next){
  console.log('-------------------------------')
  console.log('req.path: ', req.path)
  console.log('req.query: ', req.query)
  console.log('serving:' + __dirname + ROOT_DIR + req.path)
  next(); //allow next route or middleware to run
})

app.get('/recipes', function(req, res){
    console.log(req.query);
	console.log(req.query.ingredient);
	console.log(req.query.ingredients);
	getFood(req.query.ingredients, res)
    //res.send('Response send to client::'+req.query.name);

});

app.use("/",function(req,res){console.log("user use /");sendResponse(null, res)})


//app.use(express.static(__dirname + ROOT_DIR)) //provide static server

//Routes


//start server
app.listen(PORT, err => {
  if (err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT} CNTL-C to Quit`)
    console.log('To Test')
    console.log('http://localhost:3000/recipes.html')
    console.log('http://localhost:3000/recipes')
    console.log('http://localhost:3000/index.html')
    console.log('http://localhost:3000')	
    console.log('http://localhost:3000/')
  }
})


