const Movie = require('../../db').Movie;
const Seat = require('../../db').Seat;
const route = require('express').Router();


route.post('/', (req, res) => {
    var seatA_info = req.body.seatInfo.A;
    var seatB_info = req.body.seatInfo.B;
    var seatD_info = req.body.seatInfo.D;
    var rows = [seatA_info, seatB_info, seatD_info];

    Movie.create({
        name: req.body.name,
        seats_A: seatA_info.numberOfSeats,
        seats_B: seatB_info.numberOfSeats,
        seats_D: seatD_info.numberOfSeats
    }).then((movie) => {

      var i=0;
      var row_name;

      for(var row of rows){
        console.log(row);
        var seats = row;
        var aisle_seats = row.aisleSeats;
        if(i === 0){
          row_name = "A";
        }else if(i === 1){
          row_name = "B";
        }else if(i == 2){
          row_name = "D";
        }

        console.log(seats.numberOfSeats);

        for(var j = 1; j<= seats.numberOfSeats; j++){
          var reserve = aisle_seats.includes(j);

          Seat.create({
              movie_id: movie.id,
              seat_num: j,
              row_name: row_name,
              is_aisle: reserve
          }).then((seat) => {

          })
        }
        i = i + 1;
      }

      res.status(200).send({
        message: "Success :)"
      });
    }).catch((err) => {
        console.log(err);
        res.status(500).send({
            message: "Could not create new movie screen. Sorry :("
        })
    })

});

route.post('/:screen_name/reserve', (req, res) => {
  var movie_name = req.params.screen_name;
  var movie_id;

  // Movie.find({
  //     where: {
  //         name: movie_name
  //     }
  // }).then((movie) => {
  //     if(movie){
  //          movie_id  = movie.id;
  //     }else{
  //         return res.status(500).send({
  //           message: "No movie with such name exist!"
  //     });
  // }}).catch((err) => {
  //     return res.status(500).send({
  //         message: "Could not fetch listings. Sorry :( "
  //     });
  // });

  var seatA_res = req.body.seats.A;
  var seatB_res = req.body.seats.B;
  var seatD_res = req.body.seats.D;

  console.log(seatA_res," ",seatB_res," ",seatD_res);

  for(var i=0; i<3;i++){
    if(i ==0 && seatA_res != "undefined"){
      reserve_seat(movie_id, "A",seatA_res);
    }else if(i == 1 && seatB_res != "undefined"){
      reserve_seat(movie_id, "B",seatB_res);
    }else if(i == 2 && seatD_res != "undefined"){
      reserve_seat(movie_id, "D",seatD_res);
    }else{
      return res.status(500).send({
          message: "Invalid request!"
      });
    }

  }

});

function reserve_seat(movie_id, row_name, seats){
  console.log(movie_id, row_name, seats);
  for(var seat of seats){
    Seat.find({
        where: {
            movie_id: movie_id,
            row_name: row_name,
            seat_num: seat
        }
    }).then((seat_status) => {
        if(seat_status){

        }else{
            return res.status(500).send({
              message: "No movie with such name exist!"
        });
    }}).catch((err) => {
        return res.status(500).send({
            message: "Could not fetch listings. Sorry :( "
        });
    });
  }
}



route.get('/filter', (req, res) => {

conditions = [];

// console.log('Author name: ',req.query.author_name,'price', req.query.price, 'book name', req.query.book_name, 'condition ',req.query.condition, 'cdcd', req.query.price == '');

if(req.query.author_name != ''){
    conditions.push({ 'author_name': { like: '%' + req.query.author_name + '%' } });
}

if(req.query.book_name != ''){
    conditions.push({ 'book_name': { like: '%' + req.query.book_name + '%' } });
}
if(req.query.condition != ''){
    conditions.push({ 'condition': req.query.condition });
}
if(req.query.price != ''){
    conditions.push({ 'price': { between: [0, req.query.price]} });
}

console.log('conditions');

  var options = {
  where: {
    $and: conditions

  }
  };

  Listing.all(options).then((data) => {
    res.status(200).send(data);
  }).catch((err) => {
    res.status(500).send(err);
  })

});


route.get('/:id',(req,res) => {
    Listing.find({
        where: {
            id: req.params.id
        }
    }).then((listing) => {
        if(listing){
            return res.status(200).send(listing);
        }else{
            return res.status(404).send({
              message: "No listing with such id exist!"
        });
    }}).catch((err) => {
        return res.status(500).send({
            message: "Could not fetch book listings. Sorry :( "
        });
    });
});

// route.post('/add', upload.single('bookImage'), (req,res, next) => {
//    if(!req.session.user){
//        return res.status(401).send("Please login to create listing.");
//    }
//
//    console.log("Request file: ", req.file);
//    console.log("Request body: ", req.body);
//
//    cloudinary.uploader.upload(req.file.path, function(result) {
//
//      Listing.create({
//          book_name: req.body.book_name,
//          author_name: req.body.author_name,
//          price: req.body.price,
//          condition: req.body.condition,
//          userId: req.session.user.id,
//          book_image_url: result.secure_url,
//          user_name: req.session.user.name
//      }).then((listing) => {
//          res.status(201).send(listing);
//      }).catch((err) => {
//          console.log(err);
//          res.status(500).send({
//              message: "Could not create new listing. Sorry :("
//          })
//      })
// })
// // })

route.get('/delete/:id', (req,res) => {

    if(!req.session.user){
        return res.status(401).send({
          message: "Please login to delete listing."
        })
    }

    Listing.find({
        where: {
            id: req.params.id
        }
    }).then((listing) => {
        if(listing.userId === req.session.user.id){
            Listing.destroy({
                where: {
                    id: req.params.id
                }
            });
            return res.status(200).send({
                message: "Listing removed successfully!"
            });
        }else{
            return res.status(403).send({
                message: "Only seller can delete a listing"
            });
        }
    }).catch((err) => {
        return res.status(500).send({
          message: "Listing can't be deleted!"
        });
    })

});

module.exports = route;
