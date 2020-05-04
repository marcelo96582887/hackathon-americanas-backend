const connection = require('../db/db.config');

module.exports = class EspecificacoesNotProdutosController {

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
      let id = this.params.id_produto;
      if (id == undefined) id = this.query.id_produto;
      this.get(id)
    }
  }

  async get(id) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table({ a: 'especificacoes' }).whereNotExists(connection.select('*').from({ b: 'produtos_especificacoes' })
      .whereRaw('a.id=b.id_especificacao and b.id_produto=' + id))
      .count()
    const ret = await connection.table({ a: 'especificacoes' }).whereNotExists(connection.select('*').from({ b: 'produtos_especificacoes' })
      .whereRaw('a.id=b.id_especificacao and b.id_produto=' + id))
      .limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }


}
