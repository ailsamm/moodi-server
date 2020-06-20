# Moodi Server

Moodi Server works in conjunction with the [Moodi app](https://github.com/ailsamm/moodi-app). It provides a Postgresql database containing all of the data needed to populate and run the Moodi client-side app. 

## Demo

A demo version of the Moodi app, using this server, is available [here](https://moodi.now.sh/).
Use the following dummy credentials to log in and take a tour:

Please note that this demo version is intended for demo purposes only. For security purposes, we do not recommend that you sign up using your own personal information.

## Installation

Simply clone the repo and run ```npm i```
You can then make requests using, for example, Postman or the Moodi client-side app.

## Databases
This repo contains 2 routers that connect to 2 separate Postgresql tables. These are as follows:
* /api/users - contains personal information about signed up users (id, first_name, last_name, email, password)
* /api/mood-logs - contains information mood logs (user_id, mood, start_date, end_date, title, activities, sleep_hours, notes)

Further details may be found in the 'Endpoints' section.

## API Overview

```
/api
.
├── /users
│   └── GET
│       ├── /
│       └── /:userId
│
│   └── POST /
│
│   └── DELETE /:userId
│
│   └── PATCH /:userId
│
└── /mood-logs
    └── GET
        ├── /
        └── /:logId
 
    └── POST
        └── /
 
    └── DELETE /:logId
 
    └── PATCH /:logId

```

## Endpoint specifications
### GET ```/api/users```

```
// res.body
[
 {
  id: Integer,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  ranking: String
 }
]
```

### POST ```/api/users```

```
// req.body
{
  first_name: String,
  last_name: String,
  email: String,
  password: String
}

// res.body - ranking is set automatically
{
  id: Integer,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  ranking: String
}
```

### GET ```/api/users/:userId```

```
// req.params
{
  userId: Integer
}

// res.body
{
  id: Integer,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  ranking: String
}
```

### DELETE ```/api/users/:userId```

```
// req.params
{
  userId: Integer
}

// res.body
{
  status: 204
}
```

### PATCH ```/api/users/:userId```

```
// req.params
{
  userId: Integer
}

// req.body - at least one of the following
{
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  ranking: String
}

// res.body
{
  status: 204
}
```
(user_id, mood, start_date, end_date, title, activities, sleep_hours, notes)

### GET ```/api/mood-logs```

```
// res.body
[
 {
  user_id: Integer,
  mood: String, //one of: happy, sad, angry, anxious, calm, tired
  start_date: String, // format: MM-DD-YYYY
  end-date: String, // format: MM-DD-YYYY
  title: String,
  activities: String, // comma separated string
  sleep_hours: Integer,
  notes: String
 }
]
```

### POST ```/api/mood-logs```

```
// req.body
{
  user_id: Integer,
  mood: String, //one of: happy, sad, angry, anxious, calm, tired
  start_date: String, // format: MM-DD-YYYY
  end-date: String, // format: MM-DD-YYYY
  title: String,
  activities: String, // comma separated string
  sleep_hours: Integer,
  notes: String
}

// res.body
{
  user_id: Integer,
  mood: String, //one of: happy, sad, angry, anxious, calm, tired
  start_date: String, // format: MM-DD-YYYY
  end-date: String, // format: MM-DD-YYYY
  title: String,
  activities: String, // comma separated string
  sleep_hours: Integer,
  notes: String
}
```

### GET ```/api/mood-logs/:logId```

```
// req.params
{
  logId: Integer
}

// res.body
{
  user_id: Integer,
  mood: String, //one of: happy, sad, angry, anxious, calm, tired
  start_date: String, // format: MM-DD-YYYY
  end-date: String, // format: MM-DD-YYYY
  title: String,
  activities: String, // comma separated string
  sleep_hours: Integer,
  notes: String
 }
```

### DELETE ```/api/mood-logs/:logId```

```
// req.params
{
  logId: Integer
}

// res.body
{
  status: 204
}
```

### PATCH ```/api/mood-logs/:logId```

```
// req.params - at least one of the following
{
  user_id: Integer,
  mood: String, //one of: happy, sad, angry, anxious, calm, tired
  start_date: String, // format: MM-DD-YYYY
  end-date: String, // format: MM-DD-YYYY
  title: String,
  activities: String, // comma separated string
  sleep_hours: Integer,
  notes: String
}

// req.body
{
  user_id: Integer,
  mood: String, //one of: happy, sad, angry, anxious, calm, tired
  start_date: String, // format: MM-DD-YYYY
  end-date: String, // format: MM-DD-YYYY
  title: String,
  activities: String, // comma separated string
  sleep_hours: Integer,
  notes: String
}

// res.body
{
  status: 204
}
```

## Tech Stack
The Moodi Server is written with NodeJS, Express and hooks up to a Postgresql server using Knex. It also makes use of Mocha and Chai for testing purposes.
