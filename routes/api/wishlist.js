const Wishlist = require('../../db').Wishlist;
const Listing = require('../../db').Listing;
const route = require('express').Router();

route.get('/', (req, res) => {
    if(!req.session.user){
        return res.status(400).send({
        message: "Please login to see your wishlist."
      });
    }

    Listing.findAll({
      include: [{
        model: Wishlist,
        where: {userId: req.session.user.id}
      }]
    }).then((items) => {
          res.status(200).send(items);
    }).catch((err) => {
        res.status(500).send({
          message: "Couldn't fetch wishlist "
      });
    })

});

route.post('/',(req,res) => {
    if(!req.session.user){
        return res.status(400).send({
          message: "Please login to see your wishlist."
        });
    }

    Wishlist.create({
        userId: req.session.user.id,
        listingId: req.body.bookId
    }).then((item) => {
        res.status(201).send(item);
    }).catch((err) => {
        res.status(500).send({
          message: "Couldn't add item to wishlist "
        });
    })
});

route.post('/delete',(req,res) => {
    if(!req.session.user){
        return res.status(401).send({
          message: "Please login to delete item from wishlist"
      });
    }

    Wishlist.find({
        where: {
            userId: req.session.user.id,
            listingId: req.body.bookId
        }
    }).then((item) => {
        if (item) {
            Wishlist.destroy({
                where: {
                    userId: req.session.user.id,
                    listingId: req.body.bookId
                }
            });

        return res.status(200).send({
          message: "Book removed from wishlist successfully!"
        });
    }else{
        return res.status(200).send({
          message: "No book with such detail found!"
      });
    }
    }).catch((err) => {
        return res.status(500).send({
          message: "Book can't be removed from wishlist!"
        });
    })
});

exports = module.exports = route;
