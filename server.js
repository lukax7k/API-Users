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


// ========== IMOBILIÁRIA ==========

// Criar
app.post('/imobiliaria/users', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const newUser = await prisma.imobiliariaUser.create({
      data: {
        name,
        password,
        favoritos: []
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário imobiliária:', error);
    res.status(500).json({ error: 'Erro ao criar usuário imobiliária.' });
  }
});

// Listar
app.get('/imobiliaria/users', async (req, res) => {
  try {
    const users = await prisma.imobiliariaUser.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários imobiliária:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários imobiliária.' });
  }
});

// Editar
app.put('/imobiliaria/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, favoritos } = req.body;

    const updatedUser = await prisma.imobiliariaUser.update({
      where: { id },
      data: { name, password, favoritos }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao editar usuário imobiliária:', error);
    res.status(500).json({ error: 'Erro ao editar usuário imobiliária.' });
  }
});

// Deletar
app.delete('/imobiliaria/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.imobiliariaUser.delete({ where: { id } });
    res.status(204).send(); // sem conteúdo
  } catch (error) {
    console.error('Erro ao deletar usuário imobiliária:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário imobiliária.' });
  }
});

// Login Imobiliária
app.post('/imobiliaria/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const user = await prisma.imobiliariaUser.findUnique({ where: { name } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }

    // Aqui você poderia gerar token JWT, etc.
    res.status(200).json({ message: 'Login realizado com sucesso', user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error('Erro no login imobiliária:', error);
    res.status(500).json({ error: 'Erro no login imobiliária.' });
  }
});

// Buscar usuário imobiliária por ID
app.get('/imobiliaria/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.imobiliariaUser.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário imobiliária por ID:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuário imobiliária.' });
  }
});


// ========== LOJA ==========

// Criar
app.post('/loja/users', async (req, res) => {
  try {
    const { name, password, endereco, carrinho, historico } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const newUser = await prisma.lojaUser.create({
      data: {
        name,
        password,
        endereco: endereco || null,
        carrinho: carrinho || [],
        historico: historico || []
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    // 👇 Trate o erro específico de duplicidade (usuário já existe)
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return res.status(409).json({ error: 'Nome de usuário já cadastrado.' });
    }

    console.error('Erro ao criar usuário imobiliária:', error);
    res.status(500).json({ error: 'Erro ao criar usuário imobiliária.' });
  }
});

// Listar
app.get('/loja/users', async (req, res) => {
  try {
    const users = await prisma.lojaUser.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários loja:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários loja.' });
  }
});

//Listar por id

app.get('/loja/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.lojaUser.findUnique({
      where: {
        id: id, // ✅ usar como string
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
  }
});



// Editar
app.put('/loja/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, endereco, carrinho, historico } = req.body;

    const updatedUser = await prisma.lojaUser.update({
      where: { id },
      data: {
        name,
        password,
        endereco,
        carrinho,
        historico
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao editar usuário loja:', error);
    res.status(500).json({ error: 'Erro ao editar usuário loja.' });
  }
});

// Deletar
app.delete('/loja/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lojaUser.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar usuário loja:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário loja.' });
  }
});

// Login Loja
app.post('/loja/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const user = await prisma.lojaUser.findUnique({ where: { name } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso', user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error('Erro no login loja:', error);
    res.status(500).json({ error: 'Erro no login loja.' });
  }
});

// Adicionar produto ao carrinho
app.post('/loja/users/:id/carrinho', async (req, res) => {
  try {
    const { id } = req.params;
    const { produto } = req.body;

    if (!produto) {
      return res.status(400).json({ error: 'Produto é obrigatório.' });
    }

    const produtoString = JSON.stringify(produto);

    const user = await prisma.lojaUser.update({
      where: { id },
      data: {
        carrinho: {
          push: produtoString,
        }
      }
    });

    res.status(200).json({ message: 'Produto adicionado ao carrinho.', carrinho: user.carrinho });
  } catch (error) {
    console.error('Erro ao adicionar produto ao carrinho:', error);
    res.status(500).json({ error: 'Erro ao adicionar produto ao carrinho.' });
  }
});

// Buscar carrinho do usuário
app.get('/loja/users/:id/carrinho', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.lojaUser.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Converter itens do carrinho de string para objeto
    const carrinho = user.carrinho.map(item => {
      try {
        return JSON.parse(item);
      } catch {
        return item; // fallback
      }
    });

    res.status(200).json({ carrinho });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro ao buscar carrinho.' });
  }
});

// Remover item do carrinho por índice
app.delete('/loja/users/:id/carrinho/:index', async (req, res) => {
  try {
    const { id, index } = req.params;

    const user = await prisma.lojaUser.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const idx = parseInt(index);
    if (isNaN(idx) || idx < 0 || idx >= user.carrinho.length) {
      return res.status(400).json({ error: 'Índice inválido.' });
    }

    const novoCarrinho = [...user.carrinho];
    novoCarrinho.splice(idx, 1);

    const updatedUser = await prisma.lojaUser.update({
      where: { id },
      data: { carrinho: novoCarrinho }
    });

    res.status(200).json({ message: 'Item removido do carrinho.', carrinho: updatedUser.carrinho });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({ error: 'Erro ao remover item do carrinho.' });
  }
});


// ========== BLOG ==========

// Criar
app.post('/blog/users', async (req, res) => {
  try {
    const { name, password, age } = req.body;

    if (!name || !password || typeof age !== 'number') {
      return res.status(400).json({ error: 'Nome, idade (número) e senha são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const newUser = await prisma.blogUser.create({
      data: {
        name,
        password,
        age
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário blog:', error);
    res.status(500).json({ error: 'Erro ao criar usuário blog.' });
  }
});

// Listar
app.get('/blog/users', async (req, res) => {
  try {
    const users = await prisma.blogUser.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários blog:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários blog.' });
  }
});

// Editar
app.put('/blog/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, age } = req.body;

    const updatedUser = await prisma.blogUser.update({
      where: { id },
      data: {
        name,
        password,
        age
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao editar usuário blog:', error);
    res.status(500).json({ error: 'Erro ao editar usuário blog.' });
  }
});

// Deletar
app.delete('/blog/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blogUser.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar usuário blog:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário blog.' });
  }
});

// Login Blog
app.post('/blog/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    const user = await prisma.blogUser.findUnique({ where: { name } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso', user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error('Erro no login blog:', error);
    res.status(500).json({ error: 'Erro no login blog.' });
  }
});

// ========== SERVIDOR ==========

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


/*
lucasfagundesm12
xNo6QPxlJqte3J3w
*/