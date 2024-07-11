const express = require('express');
var cors = require('cors');
const app = express();
const port = 9876;

app.use(express.json());
app.use(cors());

const WINDOW_SIZE =10;
var type = "primes" ;
var server_url  = "http://20.244.56.144/test/";

let queue = [];

const fetchNumbers = async (type) => {
    try {
      const response = await axios.get(`${server_url}/${type}`, { timeout: 500 });
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