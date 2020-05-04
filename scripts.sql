DROP TABLE chave_valor;

CREATE TABLE chave_valor (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  chave TEXT NOT NULL,
	valor TEXT NOT NULL DEFAULT ''
);

CREATE UNIQUE INDEX chave_valor_UNIQUE_001 ON chave_valor(chave);

INSERT INTO chave_valor (id,chave,valor) VALUES (1,'Código','132475745');
INSERT INTO chave_valor (id,chave,valor) VALUES (2,'Código de barras','7892509087087, 7892509089135');
INSERT INTO chave_valor (id,chave,valor) VALUES (3,'Fabricante','Samsung');
INSERT INTO chave_valor (id,chave,valor) VALUES (4,'Memória RAM','1.5GB');
INSERT INTO chave_valor (id,chave,valor) VALUES (5,'Tamanho do Display','7 polegadas');
INSERT INTO chave_valor (id,chave,valor) VALUES (6,'Conexão','Wi-Fi');
INSERT INTO chave_valor (id,chave,valor) VALUES (7,'Memória Interna','8GB');
INSERT INTO chave_valor (id,chave,valor) VALUES (8,'Expansivel até?','MicroSD até 200GB');
INSERT INTO chave_valor (id,chave,valor) VALUES (9,'Alimentação, tipo de bateria','Bateria Ions de Litio 4000 mAh');
INSERT INTO chave_valor (id,chave,valor) VALUES (10,'Outras funções','Modo infantil, reprodução de mídia e Rádio FM');
INSERT INTO chave_valor (id,chave,valor) VALUES (11,'Cor','Preto');
INSERT INTO chave_valor (id,chave,valor) VALUES (12,'Conteúdo da embalagem','1 Tablet, 1 carregador, cabos de dados, 1 fone de ouvido e manual de instruções');
INSERT INTO chave_valor (id,chave,valor) VALUES (13,'Garantia do Fornecedor','12 meses');
INSERT INTO chave_valor (id,chave,valor) VALUES (14,'Dimensões do produto - cm (AxLxP)','18,6x10,8,87cm');
INSERT INTO chave_valor (id,chave,valor) VALUES (15,'Peso liquido aproximado do produto (Kg)','285g');
INSERT INTO chave_valor (id,chave,valor) VALUES (16,'Referência do Modelo','Galaxy Tab A 7 polegadas Wi-Fi');
INSERT INTO chave_valor (id,chave,valor) VALUES (17,'Modelo','SM-T280');
INSERT INTO chave_valor (id,chave,valor) VALUES (18,'SAC do Fabricante','4004-0000 (Capitais e grandes centros) / 0800-124-421 (Demais localidades)');
INSERT INTO chave_valor (id,chave,valor) VALUES (19,'Resolução','1280 x 800 (WXGA)');
INSERT INTO chave_valor (id,chave,valor) VALUES (20,'Bluetooth','Sim');
INSERT INTO chave_valor (id,chave,valor) VALUES (21,'Entradas','Conexão USB versão 2.0');
INSERT INTO chave_valor (id,chave,valor) VALUES (22,'Câmera Traseira','5MP');
INSERT INTO chave_valor (id,chave,valor) VALUES (23,'Câmera Frontal','2MP');
INSERT INTO chave_valor (id,chave,valor) VALUES (24,'Recursos de Câmera Frontal','Zoom Digital 4x, Auto Focus, Modo de foto Automático, Pro, Panorama, Foto sequencial, Embelezer rosto, Som e Foto, Esportes, Time Desativado, 2 segundos, 5 segundos, 10 segundos, Efeitos Negativo, Sépia, Escala de cinza');
INSERT INTO chave_valor (id,chave,valor) VALUES (25,'TV Digital','Não');
INSERT INTO chave_valor (id,chave,valor) VALUES (26,'Funçaõ Telefone','Não');
INSERT INTO chave_valor (id,chave,valor) VALUES (27,'GPS','Sim');
INSERT INTO chave_valor (id,chave,valor) VALUES (28,'Sistema Operacional','Android');
INSERT INTO chave_valor (id,chave,valor) VALUES (29,'Processador','Quad-Core 1.3GHz');
INSERT INTO chave_valor (id,chave,valor) VALUES (30,'Tipo de Tela','LCD TFT');


-------------------------------------------------------------------------------------------------------------------------------------------

drop table especificacoes;

create table especificacoes (
  id integer not null primary key autoincrement,
  nome text not null
);

CREATE UNIQUE INDEX especificacoes_UNIQUE_001 ON especificacoes(nome);

insert into especificacoes ( nome ) values ('Especificação Tablet Samsung T280');
insert into especificacoes ( nome ) values ('Especificação Samsung Galaxy A70');

-------------------------------------------------------------------------------------------------------------------------------------------


DROP TABLE especificacoes_itens;

CREATE TABLE especificacoes_itens (
  id_especificacao integer not null,
  id_chave_valor integer NOT NULL,
  primary key (id_especificacao, id_chave_valor),
  FOREIGN KEY (id_especificacao) REFERENCES especificacoes(id) ON UPDATE CASCADE,
	FOREIGN KEY (id_chave_valor) REFERENCES chave_valor(id) ON UPDATE CASCADE
);


-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE fabricantes;

CREATE TABLE fabricantes (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	descricao TEXT NOT NULL DEFAULT ''
);  

CREATE UNIQUE INDEX fabricantes_UNIQUE_001 ON fabricantes(descricao);
-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE produtos;

CREATE TABLE produtos (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  codigo text NOT NULL,
	descricao TEXT NOT NULL DEFAULT '',
  saldo_estoque real not null default 0,
  id_fabricante INTEGER NOT NULL,
  codigo_barras TEXT DEFAULT '',
  FOREIGN KEY (id_fabricante) REFERENCES fabricantes(id) ON UPDATE CASCADE
);  

CREATE UNIQUE INDEX produtos_UNIQUE_001 ON produtos(codigo);

-------------------------------------------------------------------------------------------------------------------------------------------


DROP TABLE imagem_produtos;

CREATE TABLE imagem_produtos (
	id INTEGER not null primary key AUTOINCREMENT,
  id_produto INTEGER NOT NULL,
  nome TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  src TEXT NOT NULL,
  FOREIGN KEY (id_produto) REFERENCES produtos(id) ON UPDATE CASCADE
  
);  

CREATE UNIQUE INDEX imagem_produtos_UNIQUE_001 ON imagem_produtos(id_produto, nome);
CREATE UNIQUE INDEX imagem_produtos_UNIQUE_002 ON imagem_produtos(id_produto, id);


-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE qrcode_produtos;

CREATE TABLE qrcode_produtos (
  id_produto INTEGER NOT NULL primary key,
  nome TEXT NOT NULL DEFAULT '',
	qrcode BLOB NOT NULL,
  link TEXT NOT NULL,
  FOREIGN KEY (id_produto) REFERENCES produtos(id) ON UPDATE CASCADE
  
);  

-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE lojas;

CREATE TABLE lojas (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  cnpj TEXT NOT NULL,
  razao_social TEXT DEFAULT '',
  logradouro TEXT DEFAULT '',
  numero TEXT DEFAULT '',
  complemento TEXT DEFAULT '',
  bairro TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  uf TEXT DEFAULT '',
  pais TEXT DEFAULT '',
  cep INTEGER DEFAULT 0,
  latitude real default 0,
  longitude real default 0
);  

CREATE UNIQUE INDEX lojas_UNIQUE_001 ON lojas(cnpj);


-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE usuario_lojas;

CREATE TABLE usuario_lojas (
  id_loja integer NOT NULL,
	id INTEGER NOT NULL primary key AUTOINCREMENT,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  ddi INTEGER NOT NULL DEFAULT 0,
  ddd INTEGER NOT NULL DEFAULT 0,
  celular INTEGER NOT NULL DEFAULT 0,
  senha TEXT NOT NULL,
  FOREIGN KEY (id_loja) REFERENCES loja(id)
);  

CREATE UNIQUE INDEX usuario_lojas_UNIQUE_001 ON usuario_lojas(email);
CREATE UNIQUE INDEX usuario_lojas_UNIQUE_002 ON usuario_lojas(id_loja, id);


-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE clientes;

CREATE TABLE clientes (
	id INTEGER NOT NULL primary key AUTOINCREMENT,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  ddi INTEGER NOT NULL DEFAULT 0,
  ddd INTEGER NOT NULL DEFAULT 0,
  celular INTEGER NOT NULL DEFAULT 0,
  senha TEXT NOT NULL
);  

CREATE UNIQUE INDEX clientes_UNIQUE_001 ON clientes(email);


-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE clientes_loja;

CREATE TABLE clientes_loja (
	id INTEGER NOT NULL primary key AUTOINCREMENT,
  id_loja integer not null,
  id_cliente integer not null,
  foreign key (id_loja) references loja(id)
);  

CREATE UNIQUE INDEX clientes_loja_UNIQUE_001 ON clientes_loja(id_loja, id_cliente);

-------------------------------------------------------------------------------------------------------------------------------------------

DROP TABLE produtos_especificacoes;


CREATE TABLE produtos_especificacoes (
  id_produto integer not null,
  id_especificacao integer not null,
  primary key (id_produto, id_especificacao),
  FOREIGN KEY (id_produto) REFERENCES produtos(id) ON UPDATE CASCADE,
	FOREIGN KEY (id_especificacao) REFERENCES especificacoes(id) ON UPDATE CASCADE
);