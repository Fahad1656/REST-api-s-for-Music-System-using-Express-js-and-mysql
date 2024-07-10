
# Music System API with Express.js and MySQL

This project implements a RESTful API for managing singers, albums, and songs using Express.js and MySQL. Users can register, login, and perform CRUD operations on singers, albums, and songs.

## Features

- User authentication with JWT tokens for secure API access.
- CRUD operations for singers, albums, and songs.
- Endpoint documentation for easy integration and usage.

## API Endpoints

### Authentication

- `POST /login`: User login with JWT authentication.
- `POST /register`: User registration.
- `POST /forget`: Forgot password functionality.
- `PATCH /reset`: Reset password with JWT authentication.
- `GET /profile`: Get user profile with JWT authentication.
- `PATCH /updateprofile`: Update user profile with JWT authentication.

### Singers

- `POST /singer`: Create a new singer.
- `GET /singer/:id?`: Get all singers or a specific singer by ID.
- `DELETE /singer/:id?`: Delete a singer by ID.
- `PATCH /singer/:id?`: Update a singer by ID.

### Albums

- `POST /album`: Create a new album.
- `GET /album/singer/:id?`: Get all albums by a specific singer.
- `GET /album/:id?`: Get all albums or a specific album by ID.
- `DELETE /album/:id?`: Delete an album by ID.
- `PATCH /album/:id?`: Update an album by ID.

### Songs

- `POST /song`: Create a new song.
- `GET /song/album/:id?`: Get all songs in a specific album.
- `GET /song/singer/:id?`: Get all songs by a specific singer.
- `GET /song/:id?`: Get all songs or a specific song by ID.
- `DELETE /song/:id?`: Delete a song by ID.
- `PATCH /song/:id?`: Update a song by ID.
