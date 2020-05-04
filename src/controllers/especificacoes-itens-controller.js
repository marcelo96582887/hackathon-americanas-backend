const connection = require('../db/db.config');

module.exports = class EspecificacoesItensController {

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
      if (this.params.id_especificacao == undefined && this.query.id_especificacao == undefined) {
        await this.getAll();
      } else {
        let id = this.params.id_especificacao;
        if (id == undefined) id = this.query.id_especificacao;
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
      if (this.params.id_chave_valor == undefined) {
        await this.deleteAll();
      } else {
        await this.delete();
      }
    }
  }

  async getAll() {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('especificacoes_itens').join('chave_valor', 'id_chave_valor', 'id').count();
    const ret = await connection.select('id_especificacao', 'id_chave_valor', 'chave', 'valor')
      .table('especificacoes_itens').join('chave_valor', 'id_chave_valor', 'id').limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }

  async get(id) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('especificacoes_itens').join('chave_valor', 'id_chave_valor', 'id').where('id_especificacao', id).count();
    const ret = await connection.select('id_especificacao', 'id_chave_valor', 'chave', 'valor')
      .table('especificacoes_itens').join('chave_valor', 'id_chave_valor', 'id').where('id_especificacao', id)
      .limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }


  async post() {
    console.log(this.body, this.query, this.put);
    const { id_especificacao, id_chave_valor } = this.body;
    let ret = {
      id_especificacao,
      id_chave_valor,
      error: null
    };

    if (id_chave_valor == undefined) {
      ret.error = 'Registro não pode ser incluído: Chave valor não informado.';
      return this.res.json(ret);
    } else {
      const [count] = await connection.table('chave_valor').where('id', id_chave_valor).count();
      if (count['count(*)'] == 0) {
        ret.error = `Chave valor ${id_chave_valor} não encontrado.`;
        return this.res.json(ret);
      }
    }

    await connection.table('especificacoes_itens').insert({ id_especificacao, id_chave_valor })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async delete() {
    const { id_especificacao, id_chave_valor } = this.params;
    let ret = {
      id_especificacao,
      id_chave_valor,
      success: null,
      error: null
    }
    await connection.table('especificacoes_itens').where({ id_especificacao, id_chave_valor }).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async deleteAll() {
    const { id_especificacao } = this.params;
    let ret = {
      id_especificacao,
      success: null,
      error: null
    }
    await connection.table('especificacoes_itens').where(id_especificacao).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
