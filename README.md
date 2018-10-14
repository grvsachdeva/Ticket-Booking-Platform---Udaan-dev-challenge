## Ticket-Booking-Platform - Udaan-dev-challenge
-------------
This project is made for Udaan Developer Challenge. 

### About the project
----------------
This project contains the API of the Ticket Booking Platform :ticket:.

### Technology Stack
-----------------
NodeJS with Express is used as framework for the development of the application. 

**Database:** MySql

**ORM used:** Sequelize

### Installation
--------------

1. In the console, download a copy of the repo by running `git clone https://github.com/gauravano/Ticket-Booking-Platform---Udaan-dev-challenge.git`.
2. Enter the new Ticket-Booking-Platform---Udaan-dev-challenge directory with `cd Ticket-Booking-Platform---Udaan-dev-challenge`.
3.[Optional] For syncing the MySql database locally, uncomment these lines https://github.com/gauravano/Ticket-Booking-Platform---Udaan-dev-challenge/blob/e408e6f8dec13bdc16885d4b85c41bc558a08e33/db.js#L14-L22 and comment these lines https://github.com/gauravano/Ticket-Booking-Platform---Udaan-dev-challenge/blob/e408e6f8dec13bdc16885d4b85c41bc558a08e33/db.js#L2-L11 and then copy these lines below lines after running `sudo mysql` in terminal:

```sql
 create database ticketing;
 create user gaurav_ticketing identified by 'Ticketing 1';
 use ticketing;
 grant all privileges on ticketing to gaurav_ticketing;
 grant all privileges on ticketing.* to gaurav_ticketing;
```

4. Run `npm start` or `node server` for a running development server. Navigate to `http://localhost:9090/`.


## Development server

Run `npm start` or `node server` for a running development server. Navigate to `http://localhost:9090/`.

## Screenshots

The **Booking platform API** is live at https://ticketing-udaan.herokuapp.com/ .

![api for posting screen details](https://user-images.githubusercontent.com/20878070/46921575-c05f5380-d01a-11e8-9ada-e8b1a25ee54c.png)
API for posting screen(movie) details

![api for reserving tickets](https://user-images.githubusercontent.com/20878070/46921574-bfc6bd00-d01a-11e8-993d-b60434267a99.png)
API for reserving movie tickets

![api for getting data](https://user-images.githubusercontent.com/20878070/46921573-bfc6bd00-d01a-11e8-972d-460fc66dbe5c.png)
API for fetching reserved/unreserved seats





If you have any question regarding this project feel free to open a [new issue](https://github.com/gauravano/Ticket-Booking-Platform---Udaan-dev-challenge/issues/new). Thanks!

 
