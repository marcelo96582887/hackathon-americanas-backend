
const express = require('express');
const routes = express.Router();

const chaveValorController = require('./controllers/chave-valor-controller');
const especificacoesController = require('./controllers/especificacoes-controller');
const especificacoesItensController = require('./controllers/especificacoes-itens-controller');
const fabricantesController = require('./controllers/fabricantes-controller');
const produtosController = require('./controllers/produtos-controller');
const imagemProdutosController = require('./controllers/imagem-produtos-controller');
const qrcodeProdutosController = require('./controllers/qrcode-produtos-controller');
const especificacoesProdutosController = require('./controllers/especificacoes-produtos-controller');
const lojasController = require('./controllers/lojas-controller');
const usuariosLojaController = require('./controllers/usuarios-loja-controller');
const clientesController = require('./controllers/clientes-controller');
const clientesLoginController = require('./controllers/clientes-login-controller');
const clientesLojaController = require('./controllers/clientes-loja-controller');
const especificacoesNotItensController = require('./controllers/especificacoes-not-itens-controller');
const especificacoesNotProdutosController = require('./controllers/especificacoes-not-produtos-controller copy');



/*----------------------- API rotas diferenciadas -------------------------*/
routes.get('/especificacoes_parametros/', (req, res) => new especificacoesNotItensController(req, res));
routes.get('/produtos_especificacoes/', (req, res) => new especificacoesNotProdutosController(req, res));
routes.post('/clientesLogin/:email:senha', (req, res) => new clientesLoginController(req, res));

/*---------------------- API tabela chave_valor -------------------------------*/
routes.get('/chave_valor', (req, res) => new chaveValorController(req, res));
routes.get('/chave_valor/:id', (req, res) => new chaveValorController(req, res));
routes.post('/chave_valor/', (req, res) => new chaveValorController(req, res));
routes.put('/chave_valor/', (req, res) => new chaveValorController(req, res));
routes.delete('/chave_valor/:id', (req, res) => new chaveValorController(req, res));


/*---------------------- API tabela especificacoes -------------------------------*/
routes.get('/especificacoes', (req, res) => new especificacoesController(req, res));
routes.get('/especificacoes/:id', (req, res) => new especificacoesController(req, res));
routes.post('/especificacoes/', (req, res) => new especificacoesController(req, res));
routes.put('/especificacoes/', (req, res) => new especificacoesController(req, res));
routes.delete('/especificacoes/:id', (req, res) => new especificacoesController(req, res));

/*---------------------- API tabela especificacoes_itens -------------------------------*/
routes.get('/especificacoes_itens', (req, res) => new especificacoesItensController(req, res));
routes.get('/especificacoes_itens/:id', (req, res) => new especificacoesItensController(req, res));
routes.post('/especificacoes_itens/', (req, res) => new especificacoesItensController(req, res));
routes.put('/especificacoes_itens/', (req, res) => new especificacoesItensController(req, res));
routes.delete('/especificacoes_itens/:id_especificacao/:id_chave_valor', (req, res) => new especificacoesItensController(req, res));


/*---------------------- API tabela fabricantes -------------------------------*/
routes.get('/fabricantes', (req, res) => new fabricantesController(req, res));
routes.get('/fabricantes/:id', (req, res) => new fabricantesController(req, res));
routes.post('/fabricantes/', (req, res) => new fabricantesController(req, res));
routes.put('/fabricantes/', (req, res) => new fabricantesController(req, res));
routes.delete('/fabricantes/:id', (req, res) => new fabricantesController(req, res));


/*---------------------- API tabela produtos -------------------------------*/
routes.get('/produtos', (req, res) => new produtosController(req, res));
routes.get('/produtos/:id', (req, res) => new produtosController(req, res));
routes.post('/produtos/', (req, res) => new produtosController(req, res));
routes.put('/produtos/', (req, res) => new produtosController(req, res));
routes.delete('/produtos/:id/:codigo', (req, res) => new produtosController(req, res));


/*---------------------- API tabela imagem_produtos -------------------------------*/
routes.get('/imagem_produtos', (req, res) => new imagemProdutosController(req, res));
routes.get('/imagem_produtos/:id', (req, res) => new imagemProdutosController(req, res));
routes.post('/imagem_produtos/', (req, res) => new imagemProdutosController(req, res));
routes.put('/imagem_produtos/', (req, res) => new imagemProdutosController(req, res));
routes.delete('/imagem_produtos/:id', (req, res) => new imagemProdutosController(req, res));


/*---------------------- API tabela qrcode_produtos -------------------------------*/
routes.get('/qrcode_produtos', (req, res) => new qrcodeProdutosController(req, res));
routes.get('/qrcode_produtos/:id', (req, res) => new qrcodeProdutosController(req, res));
routes.post('/qrcode_produtos/', (req, res) => new qrcodeProdutosController(req, res));
routes.put('/qrcode_produtos/', (req, res) => new qrcodeProdutosController(req, res));
routes.delete('/qrcode_produtos/:id', (req, res) => new qrcodeProdutosController(req, res));

/*---------------------- API tabela especificacoes_produtos -------------------------------*/
routes.get('/especificacoes_produtos', (req, res) => new especificacoesProdutosController(req, res));
routes.get('/especificacoes_produtos/:id', (req, res) => new especificacoesProdutosController(req, res));
routes.post('/especificacoes_produtos/', (req, res) => new especificacoesProdutosController(req, res));
routes.put('/especificacoes_produtos/', (req, res) => new especificacoesProdutosController(req, res));
routes.delete('/especificacoes_produtos/:id_produto/:id_especificacao', (req, res) => new especificacoesProdutosController(req, res));


/*---------------------- API tabela lojas -------------------------------*/
routes.get('/lojas', (req, res) => new lojasController(req, res));
routes.get('/lojas/:id', (req, res) => new lojasController(req, res));
routes.post('/lojas/', (req, res) => new lojasController(req, res));
routes.put('/lojas/', (req, res) => new lojasController(req, res));
routes.delete('/lojas/:id', (req, res) => new lojasController(req, res));


/*---------------------- API tabela usuario_lojas -------------------------------*/
routes.get('/usuarios_loja', (req, res) => new usuariosLojaController(req, res));
routes.get('/usuarios_loja/:id', (req, res) => new usuariosLojaController(req, res));
routes.post('/usuarios_loja/', (req, res) => new usuariosLojaController(req, res));
routes.put('/usuarios_loja/', (req, res) => new usuariosLojaController(req, res));
routes.delete('/usuarios_loja/:id', (req, res) => new usuariosLojaController(req, res));


/*---------------------- API tabela clientes -------------------------------*/
routes.get('/clientes', (req, res) => new clientesController(req, res));
routes.get('/clientes/:id', (req, res) => new clientesController(req, res));
routes.post('/clientes/', (req, res) => new clientesController(req, res));
routes.put('/clientes/', (req, res) => new clientesController(req, res));
routes.delete('/clientes/:id', (req, res) => new clientesController(req, res));

/*---------------------- API tabela clientes_loja -------------------------------*/
routes.get('/clientes_loja', (req, res) => new clientesLojaController(req, res));
routes.get('/clintes_loja/:id', (req, res) => new clientesLojaController(req, res));
routes.post('/clientes_loja/', (req, res) => new clientesLojaController(req, res));
routes.put('/clientes_loja/', (req, res) => new clientesLojaController(req, res));
routes.delete('/clientes_loja/:id', (req, res) => new clientesLojaController(req, res));

module.exports = routes;