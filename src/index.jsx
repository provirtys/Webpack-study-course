import Post from '@models/Post'
import './styles/styles.css'
import json from './assets/json.json'
import xml from './assets/data.xml'
import csv from './assets/data.csv'
import WebpackLogo from './assets/webpack-logo'
import * as $ from 'jquery'
import './styles/less.less'
import './styles/scss.scss'
import babel from '@/babel'
import React from 'react'
import { render } from 'react-dom'
import ReactDOM from 'react-dom/client';

const post = new Post('Webpack post title', WebpackLogo)
// $('pre').addClass('code').html(post.toString())

const App = () => (
  <div className="container">
    <h1>Webpack course</h1>
    <hr />
    <div className="logo"></div>
    <hr />
    <pre></pre>
    <hr />
    <div className="box">
      <h2>Less</h2>
    </div>
    <div className="card">
      <h2>Scss</h2>
    </div>
  </div>
)


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <App />
);
// console.log(post.toString());

// console.log('JSON:',json);
// console.log('XML:', xml);
// console.log('CSV:', csv);
