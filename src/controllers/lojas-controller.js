const connection = require('../db/db.config');

module.exports = class LojasController {

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
    console.log(this.query, this.params);
    if (this.methods.get) {
      if (this.params.id == undefined && this.query.id == undefined && this.params.cnpj == undefined && this.query.cnpj == undefined) {
        await this.getAll();
        console.log(1);
      } else if (this.params.cnpj == undefined && this.query.cnpj == undefined){
        let id = this.params.id;
        if (id == undefined) id = this.query.id;
        console.log(2);
        await this.get(id);
      }else{
        let cnpj = this.params.cnpj;
        if (cnpj == undefined) cnpj = this.query.cnpj;
        console.log(3);
        await this.get(cnpj);
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
    const [count] = await connection.table('lojas').count();
    const ret = await connection.select().from('*').table('lojas').limit(limit).offset((page - 1) * limit);
    this.res.header('X-Total-Count', count['count(*)']);
    return this.res.status(200).json({ret, totalReg: count['count(*)']});
  }

  async get(id) {
    const chaves = await connection.select().from('*').table('lojas').where('id', id);
    return this.res.json(chaves);
  }

  async get(cnpj) {
    const [count] = await connection.table('lojas').where('cnpj', cnpj).count();
    if(count['count(*)'] === 0){
      return this.res.status(200).json({ret: {success: false, error: 'Loja não cadastrada. Cadastre-se primeiro!!!'}});
    }
    const ret = await connection.select('id').from('*').table('lojas').where('cnpj', cnpj);
    return this.res.status(200).json({ret});
  }

  async post() {
    const { cnpj, razao_social = '', logradouro = '', numero = '', complemento = '', bairro = '', cidade = '', 
      pais = 'BR', cep = 0, latitude = 0, longitude = 0 } = this.body;
    let ret = {
      id: null,
      error: null
    }
    await connection.table('lojas').insert({ cnpj, razao_social, logradouro, numero, complemento, bairro, cidade, pais, cep, latitude, longitude })
      .then(result => ret.id = result[0])
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

  async put() {
    const { id, razao_social, logradouro, numero, complemento, bairro, cidade, pais, cep, latitude, longitude } = this.body;
    let ret = {
      id,
      success: null,
      error: null
    }
    const x = await connection.table('lojas').where('id', id).update({ razao_social, logradouro, numero, complemento, bairro, cidade, pais, cep, latitude, longitude })
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
    await connection.table('lojas').where('id', id).delete()
      .then(result => ret.success = result == 0 ? false : true)
      .catch(error => ret.error = error);
    return this.res.json(ret);
  }

}
