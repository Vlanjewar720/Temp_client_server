const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Temperature = require('./models/productModel')
const cors=require("cors")
const app = express(); // Create the express app

 // Configure express middleware 
app.use(cors())                            
app.use(bodyParser.json());  // Configure body-parser middleware to parse JSON
app.use(express.urlencoded({extended: false}))

app.get('/temperatures/max',(req, res) => {
     Temperature.findOne().sort({maxTemp:-1}).then((temp)=>{
   res.json(temp)
     });
})

app.get('/temperatures/', async(req, res) => {
  try {
    const temperatures = await Temperature.find({});
    res.status(200).json(temperatures);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/temperatures/min', async (req, res) => {
  try {
    const temperature = await Temperature.findOne().sort({minTemp:1});
    res.send(temperature);
  } catch (err) {
    console.log(err);
    res.send('Error occurred');
  }
});

app.get('/temperatures/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const temperature = await Temperature.findOne({ cityName: cityName }).select("cityName minTemp maxTemp");
    res.status(200).json(temperature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/temperatures', async(req, res) => {
  try {
      const temperature = await Temperature.create(req.body)
      res.status(200).json(temperature);
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
  }

});
// update a product
app.put('/temperatures/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const data = req.body;
    const temperature = await Temperature.findOneAndUpdate({ cityName: cityName }, data, { new: true });

      // If temperature is not found in the database
    if (!temperature) {
      return res.status(404).json({ message: `Cannot find any temperature for city ${cityName}` });
    }

    res.status(200).json(temperature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete a product

app.delete('/temperatures/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    const temperature = await Temperature.findOneAndDelete({ cityName: cityName });

    // If temperature is not found in the database
    if (!temperature) {
      return res.status(404).json({ message: `Cannot find any temperature for city ${cityName}` });
    }

    res.status(200).json({ message: `Temperature for city ${cityName} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
  mongoose.set("strictQuery", false)
  mongoose.connect('mongodb+srv://lanjewarvaibhav56:(password)@cluster0.phq7pcx.mongodb.net/?retryWrites=true&w=majority')
 .then(() => {
    console.log('connected to MongoDB')
    app.listen(3006, ()=> {
    console.log('Node API app is running on port 3006')
    });
}).catch((error) => {
    console.log(error)
})
