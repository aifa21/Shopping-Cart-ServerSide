const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const app = express()
const MongoClient = require('mongodb').MongoClient;
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xu8lv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 4000

app.get('/', (req, res) => {
  res.send('hello world');
})

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
client.connect(err => {
    const shoppingCollection = client.db("shoppingDb").collection("mobile");
    const orderCollection = client.db("shoppingDb").collection("orders");
    console.log("database connected");
    app.post('/addProduct',(req,res)=>{
        const product=req.body;
        console.log(product);
       shoppingCollection.insertMany(product)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.post('/addOrder',(req,res)=>{
        const order=req.body;
        console.log(order);
       orderCollection.insertOne(order)
        .then(result=>{
           
            res.send(result.insertedCount>0);
        })
    })
   

    app.get('/products',(req,res)=>{
        shoppingCollection.find({}).limit(20)
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })
    app.get('/product/:key',(req,res)=>{
        shoppingCollection.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys',(req,res)=>{
        const productKeys=req.body;
        // console.log(productKeys);
        shoppingCollection.find({key:{$in:productKeys}})
        .toArray((err,documents)=>{
          res.send(documents);
        })
      })

  });

app.listen(port)