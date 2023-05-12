# Wordo

# Wordo - A Word Game

Wordo is a fun word game that tests your vocabulary skills and brings joy while guessing words!

## Features

- Built with Next.js 🌐 and styled using Tailwind CSS 💅
- Utilizes Node.js serverless functions 🖥️ for handling API requests
- Implements Joi validation 🛡️ to ensure user input integrity
- Manages game data using Prisma 🗄️, an easy-to-use ORM (Object-Relational Mapping) tool

## Tech Stack

- Next.js
- Tailwind CSS
- Node.js
- Serverless Functions
- SQL Database
- Joi
- Prisma

Start playing Wordo now and enjoy an entertaining word-guessing experience! 🎮

Wordo is currently hosted by vercel.
[Click here to play Wordo!](https://wordo.vercel.app/)

## Getting Started

To run Wordo locally, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/shanipeleg/wordo

   ```

2. Install the dependencies:

   ```shell
   cd wordo
   npm install

   ```

3. Duplicate the .env.example file, remove the '.example' from the name, and add a valid link to a mysql URL

4. Run 'npm run db_push' and then 'npm run db_gen' to get the database schema and the Prisma types

5. Start the development server:

   ```shell
   npm run dev

   ```

6. Open your browser and visit http://localhost:3000 to play Wordo locally.
