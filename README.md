# DevMarketplace

An online platfrom to sell projects (websites, online platforms, scripts, ..etc) 
This repo covers the backend, you can find the frontend repo [here](https://github.com/Aymen-Dev-tech/DevMarketplace-frontend.git) 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

If you are planing to run this project localy you need:

```
Node.js: At least v18
Nest Cli
Google console account
```
Setup a .env file at the root level of your project and specify these variables: 

```
(SQlite path) DATABASE_URL
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```
### Running

Clone the repository: 
```
$ git clone https://github.com/Aymen-Dev-tech/DevMarketplace-backend.git
```

Navigate to the project directory: 

```
$ cd DevMarketplace-backend
```
Install dependencies:
```
$ npm i
```
Setup the database:
```
$ npx prisma migrate
```
Start the server: 
```
$ npm run start:dev
```
## Built With

- [Nest.js](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Prisma](https://www.prisma.io/) - Open-source next-generation ORM
## Author

- **Aymen Bounnah** - [Aymen-Dev-tech](https://github.com/Aymen-Dev-tech)





