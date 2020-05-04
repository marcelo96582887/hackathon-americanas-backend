const connection = require('../db/db.config');

module.exports = class ImagemProdutosController {

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
    console.log(this.body);
    if (this.methods.get) {
      if (this.params.id == undefined && this.query.id == undefined && this.params.id_produto == undefined && this.query.id_produto == undefined) {
        await this.getAll();
      } else if (this.params.id_produto == undefined && this.query.id_produto == undefined) {
        let id = this.params.id;
        if (id == undefined) id = this.query.id;
        await this.get(id);
      } else {
        let id_produto = this.params.id_produto;
        if (id_produto == undefined) id_produto = this.query.id_produto;
        await this.getImagemProdutos(id_produto);
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
    const { page = 1 } = this.req.query;
    const [count] = await connection.table('imagem_produtos').count();
    const ret = await connection.select().from('*').table('imagem_produtos').limit(15).offset((page - 1) * 15);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async getImagemProdutos(id_produto) {
    const { page = 1, limit = 10 } = this.req.query;
    const [count] = await connection.table('imagem_produtos').count();
    const ret = await connection.select().from('*').table('imagem_produtos').where('id_produto', id_produto).limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async get(id) {
    const chaves = await connection.select().from('*').table('imagem_produtos').where('id', id);
    return this.res.json(chaves);
  }

  async post() {
    const { id_produto, nome, link, src } = this.body;
    let ret = {
      id: null,
      error: null
    }

    if (id_produto == undefined) {
      ret.error = 'Registro não pode ser incluído: Produto não informado.';
      return this.res.json(ret);
    } else {
      const [count] = await connection.table('produtos').where('id', id_produto).count();
      if (count['count(*)'] == 0) {
        ret.error = `Produto ${id_produto} não encontrado.`;
        return this.res.json(ret);
      }
    }


    await connection.table('imagem_produtos').insert({ id_produto, nome, link, src })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);

    return this.res.json(ret);
  }

  async put() {
    const { id, nome, link, src } = this.body;
    let ret = {
      id,
      success: null,
      error: null
    }
    const x = await connection.table('imagem_produtos').where('id', id).update({ nome, link, src })
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
    await connection.table('imagem_produtos').where('id', id).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
