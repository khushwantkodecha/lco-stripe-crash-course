const cors = require('cors');
const express = require('express');
// TODO: add a stripe key here

const stripe = require('stripe')(
  'sk_test_51GxPKUBa3wE5VddFNeAUTwcatthihEv3AsHDGBJU6E0PNG0VTQmF1vfNQVcwKax5Xxg672iIYxpdCOgefxPQXhO500UigrXYVD'
);
// const uuid = require('uuid/v4');
const { v4: uuid } = require('uuid');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('it is working!!!');
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('product', product);
  console.log('price', product.price);
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});
// server listen
app.listen(8000, () => console.log('server is up and running on port 8000'));
