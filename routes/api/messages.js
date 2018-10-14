const route = require('express').Router();
const Message = require('../../db').Message;
const Listing = require('../../db').Listing;

route.get('/', (req,res) => {
  if(!req.session.user){
      return res.status(400).send({
      message:  "Please login to see the messages."
      });
  }

  Message.findAll({
    include: [{
      model: Listing,
      where: { userId: req.session.user.id }
    }]
  }).then((items) => {
        res.status(200).send(items);
  }).catch((err) => {
      res.status(500).send({
      message: "Couldn't fetch wishlist "
    });
  })
});


route.get('/:id', (req,res) => {
  console.log("Messages");

    if(!req.session.user){
        return res.status(400).send({
        message: "Please login to see the messages."
      });
    }

    Message.findAll({
        where: {
            listingId: req.params.id
        }
    }).then((messages) => {
        return res.status(200).send(messages);
    }).catch((err) => {
        return res.status(400).send({
          message: "Invalid listing Id"
        });
    });

});

route.post('/create', (req,res) => {
    if(!req.session.user){
        return res.status(400).send({
          message: "Please login to send message to the book owner."
        });
    }

    console.log("Message: ",req.body);

    Message.create({
        senderId: req.session.user.id,
        listingId: req.body.listingId,
        content: req.body.content
    }).then((message) => {
        res.status(201).send(message);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Couldn't send message to the book owner."
        });
    })
});


exports = module.exports = route;
