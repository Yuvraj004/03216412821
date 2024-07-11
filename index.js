const express = require('express');
var cors = require('cors');
const { default: axios } = require('axios');
const app = express();
const port = 9876;
require('dotenv').config();
app.use(express.json());
app.use(cors());

const WINDOW_SIZE =10;
var qname = "" ;
var server_url  = "http://20.244.56.144/test";

let queue = [];

const fetchNumbers = async (type) => {
    if (type=='p') qname = 'primes';
    else if(type=='f') qname='fibo';
    else if(type=='e') qname='even';
    else if(type == 'f') qname='rand';
    else qname = 'primes';
    try {
      const response = await axios.get(`${server_url}/${qname}`, { timeout: 500 },{
        headers:{
            "token_type": "Bearer",
            "access_token": process.env.access_token,
            "Content-Type":"application/json",
        }
      });
      console.log(response);
      return response.data.numbers;
    } catch (error) {
      console.error('Error fetching numbers:', error.message);
      return [];
    }
};

const calcAvg = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};


app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const newNumbers = await fetchNumbers(numberid);
  
    if (newNumbers.length === 0) {
      return res.status(500).send('Failed to fetch numbers.');
    }
  
    const uniqueNumbers = [...new Set(newNumbers)];
    const windowPrevState = [...queue];
  
    queue = [...queue, ...uniqueNumbers].slice(-WINDOW_SIZE);
  
    const avg = calculateAverage(queue);
  
    res.json({
      numbers: newNumbers,
      windowPrevState,
      windowCurrState: queue,
      avg: avg.toFixed(2)
    });
  });

app.listen(port,()=>{
    console.log(`Averaging on port ${port}`);
})