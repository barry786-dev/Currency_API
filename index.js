const axios = require('axios');
require('dotenv').config();
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '');

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/currency/${currencyCode}`
    );
    return response.data.map((country) => country.name.common);
  } catch {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

const convertCurrency = async (from = 'USD', to = 'JOD', amount = 100) => {
  try {
    console.log('>>>>', from, to, amount);
    /* const response = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${from}&access_key=`
    ); */
    const response = await axios.get(
      `https://api.apilayer.com/exchangerates_data/latest?symbols=${to}&base=${from}&apikey=${process.env.API_KEY}`
    );
    const rate = response.data.rates[to];
    console.log(rate);
    //}
    if (rate) {
      const countries = await getCountries(to);
      const convertedAmount = (amount * rate).toFixed(2);
      return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend these in the following countries: ${countries.join(
        ', ' // join the array of countries into a string
      )}`;
    } else {
      throw new Error(
        `from no rate Unable to get exchange rate for ${from} and ${to}`
      );
    }
  } catch (error) {
    console.log(
      error.response.data.error,
      `from catch Unable to convert currency from ${from} to ${to}`
    );
  }
};

app.get('/', async (req, res) => {
  let { from = 'USD', to = 'JOD', amount = 100 } = req.query;

  const result = await convertCurrency(from, to, amount);
  console.log(result);
  // res.json({message : result});
  res.send('Hello World!');
});

const server = app.listen(app.get('port'), () => {
  console.log(`Server is up on ${app.get('host')}${server.address().port}`);
});
/* const from = 'USA';
const to = 'JOR';
const amount = 100; */
/* convertCurrency('USD', 'JOD', 100)
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error.message);
  }); */
