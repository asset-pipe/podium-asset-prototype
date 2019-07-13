'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const e = React.createElement;

ReactDOM.render(
    e('h1', null, 'Catnip Tracker'),
    document.getElementById('header')
);
