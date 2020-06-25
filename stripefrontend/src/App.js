import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import StripeCheckout from 'react-stripe-checkout';

function App() {
  const [product, setProduct] = useState({
    name: 'React from Fb',
    price: 10,
    productBy: 'facebook',
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    console.log(token);
    const headers = {
      'Content-Type': 'application/json',
    };

    return fetch(`http://localhost:8000/payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_KEY}
          token={makePayment}
          name='Buy World!!!'
          amount={product.price * 100}
        >
          <button className='btn btn-large blue'>Pay Here</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
