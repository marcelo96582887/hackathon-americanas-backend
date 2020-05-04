const connection = require('../db/db.config');

module.exports = class EspecificacoesNotItensController {

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
      let id = this.params.id_especificacao;
      if (id == undefined) id = this.query.id_especificacao;
      this.get(id)
    }
  }

  async get(id) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table({ a: 'chave_valor' }).whereNotExists(connection.select('*').from({ b: 'especificacoes_itens' })
      .whereRaw('a.id=b.id_chave_valor and b.id_especificacao=' + id))
      .count()
    const ret = await connection.table({ a: 'chave_valor' }).whereNotExists(connection.select('*').from({ b: 'especificacoes_itens' })
      .whereRaw('a.id=b.id_chave_valor and b.id_especificacao=' + id))
      .limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }


}
