const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mcapi = require('mailchimp-api');
const bodyParser = require('body-parser')

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
// }

app.use(cors())
app.use(bodyParser.json())

const mc = new mcapi.Mailchimp('ed3d1c577fb1a130d7e83b0df443b9c0-us11');

app.post('/', (req, res) => {

  mc.lists.subscribe({id: 'b8bb9fbd61', email:{email:req.body.email}}, function(data) {
      console.log(data)
      res.json({ message: 'User subscribed successfully! Look for the confirmation email.' });

    },
    function(error) {
      if (error.error) {
        res.json({ error: error.error})
      } else {
        res.json({ error: 'There was an error subscribing that user' });
      }
    });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
