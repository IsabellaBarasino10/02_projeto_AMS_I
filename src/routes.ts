import { Router } from 'express';
import mysql from 'mysql';
 
const router = Router();
const connection = mysql.createConnection({
  host: 'localhost', // Use IPv4
  user: 'root',
  password: '',
  database: 'ts_crud'
});
 
// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1); // Encerra o processo se não conseguir conectar
  }
  console.log('Conectado ao banco de dados.');
});
 
// Rota de índice
router.get('/items', (req, res) => {
  res.send('Welcome to the API');
});
 
// Rota para criar um item (recomendado POST)
router.post('/item', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send('Name and description are required');
  }
  connection.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao criar item: ' + err);
    }
    res.status(201).json({ id: result.insertId, name, description });
  });
});
 
// Rota GET para listar dados
router.get('/leitura', (req, res) => {
  const {id} = req.query;
  if (!id) {
    return res.status(400).send('ID não fornecido');
  }
  connection.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao consultar dados');
    }
    else {
      return res.status(404).send(results);
    }
    res.json(results[0]);
  });
});
 
// Rota GET para atualizar dados (recomendado PUT)
router.get('/atualizar', (req, res) => {
  const id = req.query.id;
  const newName = req.query.name;
  if (!id || !newName) {
    return res.status(400).send('ID ou novo nome não fornecidos');
  }
  connection.query('UPDATE items SET name = ? WHERE id = ?', [newName, id], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao atualizar dados');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Linha não encontrada');
    }
    res.send('Dados atualizados com sucesso');
  });
});
 
// Rota GET para excluir dados (recomendado DELETE)
router.delete('/excluir', (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('ID não fornecido');
  }
  connection.query('DELETE FROM items WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao excluir dados');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Linha não encontrada');
    }
    res.send('Dados excluídos com sucesso');
  });
});
 
export default router;
