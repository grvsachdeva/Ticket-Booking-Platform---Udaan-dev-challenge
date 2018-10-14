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

  Movie.find({
      where: {
          name: movie_name
      }
  }).then((movie) => {
      if(movie){
           movie_id  = movie.id;
           console.log(movie_id);

           var seatA_res = req.body.seats.A;
           var seatB_res = req.body.seats.B;
           var seatD_res = req.body.seats.D;

           console.log(seatA_res," ", seatB_res," ",seatD_res);

          var row_name;
          var seats;

           for(var i=0; i<3;i++){
             if(i === 0 && Array.isArray(seatA_res)){
               console.log("AAA");
               row_name = "A";
               seats = req.body.seats.A;
               console.log("seats",seats);
             }else if(i === 1 && Array.isArray(seatB_res)){
               console.log("BBBBB");
               row_name = "B";
               seats = req.body.seats.B;
             }else if(i === 2 && Array.isArray(seatD_res)){
               console.log("DDDD");
               row_name = "D";
               seats = req.body.seats.D;
             }else{
               continue;
             }

             for(var seat of seats){
               Seat.find({
                   where: {
                       movie_id: movie_id,
                       row_name: row_name,
                       seat_num: seat
                   }
               }).then((seat_status) => {
                   if(seat_status){
                      seat_status.updateAttributes({
                        reserved: true
                      })
              }else{
                       return res.status(500).send({
                         message: "Seat not available!"
                   });
               }}).catch((err) => {
                   return res.status(500).send({
                       message: "There is error while booking tickets :( "
                   });
               });
             }
           }

                 res.status(200).send({
                   message: "Success :)"
                 });
      }else{
          return res.status(500).send({
            message: "No movie with such name exist!"
      });
  }}).catch((err) => {
      return res.status(500).send({
          message: "Could not fetch listings. Sorry :( "
      });
  });

});

route.get('/:screen_name/seats',(req,res) => {
  var status = req.query.status;

  Movie.find({
      where: {
          name: req.params.screen_name
      }
  }).then((movie) => {
      if(movie){
           movie_id  = movie.id;

           Seat.find({
               where: {
                    movie_id: movie.id,
                    is_reserved: status
               }
           }).then((seats) => {
               if(seats){
                   return res.status(200).send(seats);
               }else{
                   return res.status(404).send({
                     message: "No listing with such status exist!"
               });
           }}).catch((err) => {
               return res.status(500).send({
                   message: "Could not fetch listings. Sorry :( "
               });
           });

      }else{
          return res.status(500).send({
            message: "No movie with such name exist!"
      });
  }}).catch((err) => {
      return res.status(500).send({
          message: "Could not fetch listings. Sorry :( "
      });
  });

});


// route.get('//:id', (req,res) => {
//
//     Listing.find({
//         where: {
//             id: req.params.id
//         }
//     }).then((listing) => {
//         if(listing.userId === req.session.user.id){
//             Listing.destroy({
//                 where: {
//                     id: req.params.id
//                 }
//             });
//             return res.status(200).send({
//                 message: "Listing removed successfully!"
//             });
//         }else{
//             return res.status(403).send({
//                 message: "Only seller can delete a listing"
//             });
//         }
//     }).catch((err) => {
//         return res.status(500).send({
//           message: "Listing can't be deleted!"
//         });
//     })
//
// });

module.exports = route;
