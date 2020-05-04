const connection = require('../db/db.config');

module.exports = class produtosController {

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
    const [count] = await connection.table('produtos').count();
    const ret = await connection.select('a.id', 'a.codigo', 'a.descricao', 'a.saldo_estoque', 'a.id_fabricante', { fabricante: 'b.descricao' }, 'codigo_barras', 'c.nome', 'c.link')
      .from({ a: 'produtos' }).leftJoin({ b: 'fabricantes' }, function () {
        this.on('a.id_fabricante', '=', 'b.id')
      })
      .leftJoin({ c: 'qrcode_produtos' }, function () {
        this.on('a.id', '=', 'c.id_produto')
      })
      .limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ ret, totalReg: count['count(*)'] });
  }

  async get(id) {
    const ret = await connection.select('a.id', 'a.codigo', 'a.descricao', 'a.saldo_estoque', 'a.id_fabricante', { fabricante: 'b.descricao' }, 'codigo_barras', 'c.nome', 'c.link')
      .from({ a: 'produtos' }).leftJoin({ b: 'fabricantes' }, function () {
        this.on('a.id_fabricante', '=', 'b.id')
      })
      .leftJoin({ c: 'qrcode_produtos' }, function () {
        this.on('a.id', '=', 'c.id_produto')
      }).where('a.id', id);
    return this.res.json(ret);
  }

  async post() {
    let { codigo, descricao, saldo_estoque, id_fabricante, descricao_fabricante, codigo_barras = '' } = this.body;
    let ret = {
      id: null,
      error: null
    };
    
    if (id_fabricante === undefined || id_fabricante === 0) {
      const r = await connection.table('fabricantes').insert({ descricao: descricao_fabricante });
      id_fabricante = r[0];
    }

    if (id_fabricante > 0) {
      const [count] = await connection.table('fabricantes').where('id', id_fabricante).count();
      if (count['count(*)'] == 0) {
        ret.error = `Fabricante ${id_fabricante} não encontrado.`;
        return this.res.json(ret);
      }
    }

    await connection.table('produtos').insert({ codigo, descricao, saldo_estoque, id_fabricante, codigo_barras })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async put() {
    let { id, descricao, saldo_estoque, id_fabricante, descricao_fabricante, codigo_barras } = this.body;
    let ret = {
      id,
      success: null,
      error: null
    }
    let verId = null;
    const [ rx ] = await connection.table('fabricantes').where('descricao', descricao_fabricante).count();
    if (rx['count(*)'] === 0) {
      const data = { descricao: descricao_fabricante};
      const r = await connection.table('fabricantes').insert(data);
      id_fabricante = r[0];
    }else{
      const [ rx ] = await connection.table('fabricantes').select('id').where('descricao', descricao_fabricante);
      verId = rx.id;
      if(id_fabricante !== verId && verId){
        id_fabricante = verId;
      }
    }

    if (id_fabricante > 0 ) {
      const [count] = await connection.table('fabricantes').where('id', id_fabricante).count();
      if (count['count(*)'] == 0) {
        ret.error = `Fabricante ${id_fabricante} não encontrado.`;
        return this.res.json(ret);
      }
    }

    const x = await connection.table('produtos').where('id', id).update({ descricao, saldo_estoque, id_fabricante, codigo_barras })
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
    await connection.table('produtos').where({ 'id': id }).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
