const Listing = require('../../db').Listing;
const route = require('express').Router();
const multer = require('multer');

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'gauravano',
  api_key: '383633388983891',
  api_secret: 'MaqAJcecyMtfheySU4glmqVkBmk'
});


// Set The Storage Engine
const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});


// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype){
        return cb(null,true);
    } else {
        cb('message: Images Only!');
    }
}

route.get('/', (req, res) => {
    Listing.findAll()
        .then((listings) => {
            res.status(200).send(listings);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not fetch book listings. Sorry :( "
            })
        })
});

route.get('/user', (req, res) => {

    if(!req.session.user){
        return res.status(401).send({
            message: "Please login to view your listings."
        });
    }

      Listing.findAll({
        where: {
          userId: req.session.user.id
        }
      }).then((listings) => {
            res.status(200).send(listings);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not fetch book listings. Sorry :( "
            })
        })
});


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

route.post('/add', upload.single('bookImage'), (req,res, next) => {
   if(!req.session.user){
       return res.status(401).send("Please login to create listing.");
   }

   console.log("Request file: ", req.file);
   console.log("Request body: ", req.body);

   cloudinary.uploader.upload(req.file.path, function(result) {

     Listing.create({
         book_name: req.body.book_name,
         author_name: req.body.author_name,
         price: req.body.price,
         condition: req.body.condition,
         userId: req.session.user.id,
         book_image_url: result.secure_url,
         user_name: req.session.user.name
     }).then((listing) => {
         res.status(201).send(listing);
     }).catch((err) => {
         console.log(err);
         res.status(500).send({
             message: "Could not create new listing. Sorry :("
         })
     })
})
})

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
