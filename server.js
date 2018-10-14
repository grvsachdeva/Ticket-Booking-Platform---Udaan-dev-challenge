const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes/api').route);
app.set('port', (process.env.PORT || 9090));

// app.use('/listings/:id',express.static('public'));
// app.use('/listings/add',express.static('public'));
// app.use('/messages',express.static('public'));
// app.use('/wishlist',express.static('public'));
// app.use('/dashboard',express.static('public'));
app.all('*',(req, res) => {
  res.redirect('/');
})


app.listen(app.get('port'), function () {
   console.log("Node app is running at Port: ", app.get('port'));
});
