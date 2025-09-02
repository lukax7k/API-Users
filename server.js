import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js';

import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});


const app = express();
app.use(express.json());
app.use(cors())

app.post('/users', async (req, res) => {

  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  });

  res.status(201).json(req.body);
});

app.get('/users', async (req, res) => {

  let users = [];

  if(req.query){
    users = await prisma.user.findMany({
      where: {
        name: req.query.name,
        age: req.query.age
      }
    })
  } else {

  }

  res.status(200).json(users);
});

app.put('/users/:id', async (req, res) => {

  await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    }
  });

  res.status(201).json(req.body);
});

app.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    }
  });
  res.status(200).json({message: 'Usuário deletado com sucesso.'});
});

app.listen(3000);

/*
lucasfagundesm12
xNo6QPxlJqte3J3w
*/