require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

console.log("Server rodando...");

// Configurando Sequelize
let sequelize;
if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: 'localhost',
      dialect: 'postgres',
    },
  );
}

// Testando a conexão com o banco de dados
sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados bem-sucedida!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Definindo o modelo de usuário
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {});

// Sincronizando o modelo com o banco de dados
sequelize.sync({ force: false })
  .then(() => console.log('Tabelas sincronizadas com sucesso!'))
  .catch(err => console.error('Erro ao sincronizar tabelas:', err));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}));

// Rotas
app.get('/', (req, res) => {
  res.redirect('/1 Home/index.html');
});

// Rota de registro
app.post('/register', async (req, res) => {
  const { username, name, email, password, confirm_password } = req.body;

  if (!username || !name || !email || !password || !confirm_password) {
    return res.status(400).send('Por favor, preencha todos os campos obrigatórios.');
  }

  if (password !== confirm_password) {
    return res.status(400).send('As senhas não coincidem.');
  }

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).send('Erro: Nome de usuário ou email já existe.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, name, email, password: hashedPassword });
    res.redirect('/1 Home/usuarioregistrado.html');
  } catch (err) {
    res.status(500).send('Erro interno: ' + err.message);
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.redirect('/1 Home/usuariologado.html');
    } else {
      res.status(401).send('Credenciais inválidas.');
    }
  } catch (err) {
    res.status(500).send('Erro interno: ' + err.message);
  }
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Rota para obter o usuário logado
app.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, name: req.session.user.name });
  } else {
    res.json({ success: false, message: 'Usuário não logado' });
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
