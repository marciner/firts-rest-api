var express = require('express');
var mongoskin = require('mongoskin');
var bodyParser = require('body-parser');
var logger = require('morgan');


//tworzenie instacji aplikacji
var app = express();

//instrukcje konfiguracyjne
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
//monitorowanie zadan
app.use(logger());

//łączenie sie z baza danych
var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true});

var id = mongoskin.helper.toObjectID;

app.param('CollectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName);
    return next();
});

app.get('/', function(req, res, next){
    res.send('Wybierz kolekcjei np /mess');
});

app.get('/collections/:collectionName', function(req, res, next){
    req.collection.find({}, {
        limit:10, sort: [['_id', -1]]
    }).toArray(function(e, results){
        if(e) return next(e);
        res.send(results);
    });
});

app.post('/collections/:collectionName', function(req, res, next){
    req.collection.insert(req.body, {}, function(e, results){
        if(e) return next(e);
        res.send(results);
    })
});

app.get('/collections/:collectionName/:id', function(req, res, next){
    req.collection.findOne({
        id: id(req.params.id)
    }, function(e, result){
        if (e) return next(e);
        res.send(result);
        }
    );
});

app.put('/collections/:collectionName/:id', function(req, res, next) {
    req.collection.update({
        _id: id(req.params.id)
    }, {$set:req.body}, {safe:true, multi:false},
    function(e, result){
        if (e) return next(e);
        res.send((result === 1) ? {msg:'success'} : {msg:'error'});
    });
});


app.del('/collections/:collectionName/:id', function(req, res, next) {
    req.collection.remove({
        _id: id(req.params.id)
    },
    function(e, result){
        if (e) return next(e);
        res.send((result === 1) ? {msg:'success'} : {msg:'error'});
    });
});


app.listen(3000, function(){
    console.log ('Serwer jest uruchomiony')
})