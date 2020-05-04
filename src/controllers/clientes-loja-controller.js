const connection = require('../db/db.config');

module.exports = class ClientesLojaController {

  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.methods = req.route.methods;
    this.params = req.params;
    this.query = req.query;
    this.body = req.body;
    this.run()

  }

  async run() {
    if (this.methods.get) {
      if (this.params.id_cliente == undefined && this.query.id_cliente == undefined) {
        await this.getAll();
      } else {
        let id = this.params.id_cliente;
        if (id == undefined) id = this.query.id_cliente;
        this.get(id)
      }
    } else if (this.methods.post) {
      await this.post();
    } else if (this.methods.put) {
      if (this.body.id == undefined) {
        await this.putAll();
      } else {
        await this.put();
      }
    } else if (this.methods.delete) {
      if (this.params.id_loja == undefined) {
        await this.deleteAll();
      } else {
        await this.delete();
      }
    }
  }

  async getAll() {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table({a:'clientes_loja'}).join({b:'lojas'}, function(){
      this.on('a.id_loja', '=', 'b.id')
    })
    .join({c:'clientes'}, function(){
      this.on('a.id_cliente', '=', 'c.id')
    })
    .count();
    const ret = await connection.select({id_clientes_loja: 'a.id'}, 'a.id_cliente', 'b.nome', 'b.email', 
      'b.ddi', 'b.ddd', 'b.celular', 'a.id_loja', 'c.cnpj', 'c.razao_social', 'c.latitude', 'c.longitude')
      .from({a:'clientes_loja'}).join({b:'clientes'}, function(){
        this.on('b.id', '=', 'a.id_cliente')
      })
      .join({c: 'lojas'}, function(){
        this.on('c.id', '=', 'a.id_loja')
      })
      .limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });

  }

  async get(id) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table({a:'clientes_loja'}).join({b:'lojas'}, function(){
      this.on('a.id_loja', '=', 'b.id')
    })
    .join({c:'clientes'}, function(){
      this.on('a.id_cliente', '=', 'c.id')
    })
    .count();
    const ret = await connection.select({id_clientes_loja: 'a.id'}, 'a.id_cliente', 'b.nome', 'b.email', 
      'b.ddi', 'b.ddd', 'b.celular', 'a.id_loja', 'c.cnpj', 'c.razao_social', 'c.latitude', 'c.longitude')
      .from({a:'clientes_loja'}).join({b:'clientes'}, function(){
        this.on('b.id', '=', 'a.id_cliente')
      })
      .join({c: 'lojas'}, function(){
        this.on('c.id', '=', 'a.id_loja')
      }).where('a.id_cliente', id)
      .limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }


  async post() {
    const { id_cliente, id_loja } = this.body;
    let ret = {
      id_cliente: null,
      id_loja,
      error: null
    };

    if (id_loja == undefined) {
      ret.error = 'Registro não pode ser incluído: Loja não informada.';
      return this.res.json(ret);
    } else {
      const [count] = await connection.table('lojas').where('id', id_loja).count();
      if (count['count(*)'] == 0) {
        ret.error = `Loja ${id_loja} não encontrado.`;
        return this.res.json(ret);
      }
    }

    if (id_cliente == undefined) {
      ret.error = 'Registro não pode ser incluído: Cliente não informado.';
      return this.res.json(ret);
    } else {
      const [count] = await connection.table('clientes').where('id', id_cliente).count();
      if (count['count(*)'] == 0) {
        ret.error = `Cliente ${id_cliente} não encontrado.`;
        return this.res.json(ret);
      }
    }

    await connection.table('clientes_loja').insert({ id_cliente, id_loja })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async delete() {
    const { id_cliente, id_loja } = this.params;
    let ret = {
      id_cliente,
      id_loja,
      success: null,
      error: null
    }
    await connection.table('clintes_loja').where({ id_cliente, id_loja }).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async deleteAll() {
    const { id_cliente } = this.params;
    let ret = {
      id_cliente,
      success: null,
      error: null
    }
    await connection.table('clientes_loja').where(id_cliente).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
