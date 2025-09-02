import express from 'express';
import cors from 'cors';
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
app.use(cors());

// ---------- Imobiliária ----------
app.post('/imobiliaria-users', async (req, res) => {
  try {
    const { name, senha } = req.body;

    if (!name || !senha) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const newUser = await prisma.imobiliariaUser.create({
      data: {
        name,
        senha,
        favoritos: []  // começa vazio
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});



app.get('/imobiliaria/users', async (req, res) => {
  const users = await prisma.imobiliariaUser.findMany();
  res.status(200).json(users);
});

// ---------- Loja ----------
app.post('/loja/users', async (req, res) => {
  const user = await prisma.lojaUser.create({
    data: {
      nome: req.body.nome,
      senha: req.body.senha,
      endereco: req.body.endereco,
      carrinho: req.body.carrinho || [],
      historico: req.body.historico || []
    }
  });
  res.status(201).json(user);
});


app.get('/loja/users', async (req, res) => {
  const users = await prisma.lojaUser.findMany();
  res.status(200).json(users);
});

// ---------- Blog ----------
app.post('/blog/users', async (req, res) => {
  const user = await prisma.blogUser.create({
    data: {
      nome: req.body.nome,
      idade: req.body.idade,
      senha: req.body.senha
    }
  });
  res.status(201).json(user);
});

app.get('/blog/users', async (req, res) => {
  const users = await prisma.blogUser.findMany();
  res.status(200).json(users);
});

// Inicia servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


/*
lucasfagundesm12
xNo6QPxlJqte3J3w
*/