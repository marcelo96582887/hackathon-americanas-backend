const connection = require('../db/db.config');

module.exports = class UsuariosLojaController {

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
      if (this.params.id == undefined && this.query.id == undefined && this.params.id_loja == undefined && this.query.id_loja == undefined) {
        await this.getAll();
      } else if (this.params.id_loja == undefined && this.query.id_loja == undefined) {
        let id = this.params.id;
        if (id == undefined) id = this.query.id;
        await this.get(id);
      } else {
        let id_loja = this.params.id_loja;
        if (id_loja == undefined) id_loja = this.query.id_loja;
        await this.getUsuarioLojas(id_loja);
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
    const [count] = await connection.table('usuario_lojas').count();
    const ret = await connection.select().from('*').table('usuario_lojas').limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async getUsuarioLojas(id_loja) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('usuario_lojas').count();
    const ret = await connection.select().from('*').table('usuario_lojas').where('id_loja', id_loja).limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async get(id) {
    const chaves = await connection.select().from('*').table('usuario_lojas').where('id', id);
    return this.res.json(chaves);
  }

  async post() {
    const { id_loja, email, nome = '', ddi = 0, ddd = 0, celular = 0, senha } = this.body;
    let ret = {
      id: null,
      error: null
    }

    if (id_loja == undefined) {
      ret.error = 'Registro não pode ser incluído: Loja não informado.';
      return this.res.json(ret);
    } else {
      const [count] = await connection.table('loja').where('id', id_loja).count();
      if (count['count(*)'] == 0) {
        ret.error = `Loja ${id_produto} não encontrado.`;
        return this.res.json(ret);
      }
    }

    if (senha == undefined || senha == '') {
      ret.error = `Senha inválida.`;
      return this.res.json(ret);
    }


    await connection.table('usuario_lojas').insert({ id_loja, email, nome, ddi, ddd, celular, senha })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);

    return this.res.json(ret);
  }

  async put() {
    const { id, nome, ddi, ddd, celular } = this.body;
    let ret = {
      id,
      success: null,
      error: null
    }
    const x = await connection.table('usuario_lojas').where('id', id).update({ nome, ddi, ddd, celular })
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
    await connection.table('usuario_lojas').where('id', id).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
