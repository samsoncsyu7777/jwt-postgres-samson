/ changePassword with oldpassword and password length>=6
/ edit roles
/ search with key words(search=)
/ sort(sort=sharingstring:desc)
X forget password with sending email?

# REST API with POSTGRESQL Database
## Node.js Express JWT Sequelize
### Babel, Nodemon, Bcryptjs, Cookie-parser, CORS, Dotenv
### Filtering, Pagination, Sorting
## Features:
##### JWT is stored in Cookies
##### Only administrator with "admin" role can enable and update users
##### Every title belongs to a sharing and every sharing belongs to a user
##### Public visitors can visit all titles
##### Users with "user" role can access their own sharings
##### Public visitors cannot access any sharings
##### Users with "moderator" role can access all sharings
##### Users can change their password
##### Get all titles or sharings with keywords, pages, limits and sorting
## Usage
### POST "/api/auth/signup"
##### {
#####   "username": string,
#####   "email": string,
#####   "password": string
##### }
### POST "/api/auth/signin"
##### {
#####   "username": string,
#####   "password": string
##### }
### POST "/api/auth/enableuser" with "admin" role
##### {
#####   "id": integer
##### }
### POST "/api/auth/changepassword"
##### {
#####   "oldpassword": string,
#####   "password": string
##### }
### POST "/api/auth/updateuser" with "admin" role
##### {
#####   "id": integer,
#####   "username": string,
#####   "email": string,
#####   "password": string,
#####   "enabled": boolean,
#####   "roles": [string]
##### }
### GET "/api/auth/users?search=abc&sort=id:desc&page=3&limit=10" with "admin" role
##### {
#####   "users": {
#####     "count": integer,
#####     "rows": [
#####       {
#####         "id": integer,
#####         "username": string,
#####         "email": string,
#####         "password": string,
#####         "enabled": boolean,
#####         "createdAt": timestamp,
#####         "updatedAt": timestamp
#####       }
#####     ]
#####   }
##### }
### GET "/api/auth/users/:id" with "admin" role
##### {
#####   "id": integer,
#####   "username": string,
#####   "email": string,
#####   "password": string,
#####   "enabled": boolean,
#####   "createdAt": timestamp,
#####   "updatedAt": timestamp
##### }
### POST "/api/share/create"
##### {
#####   "titelstring": string,
#####   "sharingstring": string
##### }
### POST "/api/share/sharing/:id/update" with user authorization
##### {
#####   "titelstring": string,
#####   "sharingstring": string
##### }
### GET "/api/share/sharing/:id" with user authorization or "moderator" role
##### {
#####   "sharingstring": string
##### }
### GET "/api/share/sharings?search=abc&sort=id:desc&page=3&limit=10" with "moderator" role
##### {
#####   "sharings": {
#####     "count": integer,
#####     "rows": [
#####       {
#####         "id": integer,
#####         "sharingstring": string,
#####         "createdAt": timestamp,
#####         "updatedAt": timestamp,
#####         "userId": integer
#####       }
#####     ]
#####   }
##### }
### GET "/api/share/titles?search=abc&sort=id:desc&page=3&limit=10"
##### {
#####   "titles": {
#####     "count": integer,
#####     "rows": [
#####       {
#####         "id": integer,
#####         "titlestring": string,
#####         "createdAt": timestamp,
#####         "updatedAt": timestamp,
#####         "sharingId": integer
#####       }
#####     ]
#####   }
##### }
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
#####
