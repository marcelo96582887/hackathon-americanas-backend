const connection = require('../db/db.config');

module.exports = class EspecificacoesProdutosController {

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
      if (this.params.id_produto == undefined && this.query.id_produto == undefined) {
        await this.getAll();
      } else {
        let id = this.params.id_produto;
        if (id == undefined) id = this.query.id_produto;
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
      if (this.params.id_especificacao == undefined) {
        await this.deleteAll();
      } else {
        await this.delete();
      }
    }
  }

  async getAll() {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('produtos_especificacoes').join('especificacoes', 'id_produto', 'id').count();
    const ret = await connection.select('id_produto', 'id_especificacao', 'nome')
      .table('produtos_especificacoes').join('especificacoes', 'id_especificacao', 'id').limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }

  async get(id) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('produtos_especificacoes').join('especificacoes', 'id_especificacao', 'id').where('id_produto', id).count();
    const ret = await connection.select('id_produto', 'id_especificacao', 'nome')
      .table('produtos_especificacoes').join('especificacoes', 'id_especificacao', 'id').where('id_produto', id)
      .limit(limit).offset((page - 1) * limit);
    console.log('ret: ', ret);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }


  async post() {
    const { id_produto, id_especificacao } = this.body;
    let ret = {
      id_produto,
      id_especificacao,
      error: null
    };

    if (id_especificacao == undefined) {
      ret.error = 'Registro não pode ser incluído: especificação não informada.';
      return this.res.json(ret);
    } else {
      const [count] = await connection.table('especificacoes').where('id', id_especificacao).count();
      if (count['count(*)'] == 0) {
        ret.error = `Especificacao ${id_especificacao} não encontrada.`;
        return this.res.json(ret);
      }
    }

    await connection.table('produtos_especificacoes').insert({ id_produto, id_especificacao })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async delete() {
    const { id_produto, id_especificacao } = this.params;
    let ret = {
      id_produto,
      id_especificacao,
      success: null,
      error: null
    }
    await connection.table('produtos_especificacoes').where({ id_produto, id_especificacao }).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async deleteAll() {
    const { id_produto } = this.params;
    let ret = {
      id_produto,
      success: null,
      error: null
    }
    await connection.table('produtos_especificacoes').where(id_produto).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
