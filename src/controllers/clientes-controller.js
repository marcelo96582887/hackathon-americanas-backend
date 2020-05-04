const connection = require('../db/db.config');

module.exports = class ClientesController {

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
      if (this.params.id == undefined && this.query.id == undefined) {
        await this.getAll();
      } else {
        let id = this.params.id;
        if (id == undefined) id = this.query.id;
        await this.get(id);
      } 
    } else if (this.methods.post) {
      await this.post();
    } else if (this.methods.put) {
      await this.put();
    } else if (this.methods.delete) {
      await this.delete();
    }
  }

  async getAll() {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('clientes').count();
    const ret = await connection.select().from('*').table('clientes').limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async get(id) {
    const ret = await connection.select().from('*').table('clientes').where('id', id);
    return this.res.json(ret);
  }

  async post() {
    const { email, nome = '', ddi = 0, ddd = 0, celular = 0, senha } = this.body;
    let ret = {
      id: null,
      error: null
    }

    if (senha == undefined || senha == '') {
      ret.error = `Senha inválida.`;
      return this.res.json(ret);
    }

    await connection.table('clientes').insert({ email, nome, ddi, ddd, celular, senha })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);

    return this.res.json(ret);
  }

  async put() {
    const { nome, ddi, ddd, celular } = this.body;
    let ret = {
      id,
      success: null,
      error: null
    }
    const x = await connection.table('clientes').where('id', id).update({ nome, ddi, ddd, celular })
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async delete() {
    const { id } = this.params;
    let ret = {
      id,
      success: null,
      error: null
    }
    await connection.table('clientes').where('id', id).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
