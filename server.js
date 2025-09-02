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
app.post('/imobiliaria/users', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const newUser = await prisma.imobiliariaUser.create({
      data: {
        name,
        password,
        favoritos: []  // começa vazio
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário imobiliária:', error);
    res.status(500).json({ error: 'Erro ao criar usuário imobiliária.' });
  }
});

app.get('/imobiliaria/users', async (req, res) => {
  try {
    const users = await prisma.imobiliariaUser.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários imobiliária:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários imobiliária.' });
  }
});

// ---------- Loja ----------
app.post('/loja/users', async (req, res) => {
  try {
    const { name, password, endereco, carrinho, historico } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const newUser = await prisma.lojaUser.create({
      data: {
        nome: name,           // mapeando para o campo do schema
        senha: password,      // mapeando para o campo do schema
        endereco: endereco || null,
        carrinho: carrinho || [],
        historico: historico || []
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário loja:', error);
    res.status(500).json({ error: 'Erro ao criar usuário loja.' });
  }
});

app.get('/loja/users', async (req, res) => {
  try {
    const users = await prisma.lojaUser.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários loja:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários loja.' });
  }
});

// ---------- Blog ----------
app.post('/blog/users', async (req, res) => {
  try {
    const { name, password, idade } = req.body;

    if (!name || !password || typeof idade !== 'number') {
      return res.status(400).json({ error: 'Nome, idade (número) e senha são obrigatórios.' });
    }

    const newUser = await prisma.blogUser.create({
      data: {
        nome: name,         // mapeando para o campo do schema
        idade,
        senha: password     // mapeando para o campo do schema
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário blog:', error);
    res.status(500).json({ error: 'Erro ao criar usuário blog.' });
  }
});

app.get('/blog/users', async (req, res) => {
  try {
    const users = await prisma.blogUser.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários blog:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários blog.' });
  }
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