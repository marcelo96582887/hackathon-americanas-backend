const connection = require('../db/db.config');

module.exports = class EspecificacoesController {

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
    console.log(this.params, this.query, this.body);
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
    const [count] = await connection.table('especificacoes').count();
    const ret = await connection.select().from('*').table('especificacoes').limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async get(id) {
    const chaves = await connection.select().from('*').table('especificacoes').where('id', id);
    return this.res.json(chaves);
  }

  async post() {
    const { nome } = this.body;
    let ret = {
      id: null,
      error: null
    }
    await connection.table('especificacoes').insert({ nome })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async put() {
    const { id, nome } = this.body;
    let ret = {
      id,
      success: null,
      error: null
    }
    const x = await connection.table('especificacoes').where('id', id).update({ nome })
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async delete() {
    console.log(this.body, this.query, this.params);
    const { id } = this.params;
    let ret = {
      id,
      success: null,
      error: null
    }
    await connection.table('especificacoes').where('id', id).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
      console.log('ret: ', ret);
    if(ret.error == null){
      await connection.table('especificacoes_itens').where('id_especificacao', id).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    }
    return this.res.json(ret);
  }

}
