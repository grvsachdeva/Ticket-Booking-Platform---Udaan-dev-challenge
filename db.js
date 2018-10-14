// -------- Production heroku ----------
const Sequelize = require('sequelize');

const db = new Sequelize('heroku_d806c6567391c01', 'b0b3a0a85c2dbc', '28875add', {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    dialect: 'mysql',
    pool:{
        min: 0,
        max: 5
    }
});

// -------- Development --------
// const Sequelize = require('sequelize')
//  const db = new Sequelize('ticketing', 'gaurav_ticketing', 'Ticketing 1', {
//     host: 'localhost',
//     dialect: 'mysql',
//     pool: {
//         min: 0,
//         max: 5,
//     }
// })


const Movie = db.define('movies', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    seats_A: {
      type: Sequelize.INTEGER
    },
    seats_B: {
      type: Sequelize.INTEGER
    },
    seats_D: {
      type: Sequelize.INTEGER
    }
});

const Seat = db.define('aisle_seats', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey: true
   },
   movie_id: {
       type: Sequelize.INTEGER,
       allowNull: false
   },
    seat_num: {
       type: Sequelize.INTEGER,
       allowNull: false
    },
    row_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    is_aisle: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    is_reserved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
});

db.sync().then(() => console.log("Database has been synced! "))
         .catch((err) => console.log("Error creating database! "));

exports = module.exports = {
    Seat, Movie
};
