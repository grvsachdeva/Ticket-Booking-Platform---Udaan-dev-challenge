# Preparing the Database on local machine

Do the following as root

```sql
 create database ticketing;
 create user gaurav_ticketing identified by 'Ticketing 1';
 use ticketing;
 grant all privileges on ticketing to gaurav_ticketing;
 grant all privileges on ticketing.* to gaurav_ticketing;
```
