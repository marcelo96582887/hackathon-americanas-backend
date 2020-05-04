const connection = require('../db/db.config');

module.exports = class ClientesLoginController {

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
    if (this.methods.post) {
      await this.post();
    } 
  }

  async post() {
    const [email, senha] = this.body;
    const [count] = await connection.table('clientes').where({email, senha}).count();
    if(count['count(*)'] === 0){
      return this.res.status(200).json({success: false, error: 'Usuário não encontrado!!!'});
    }
    const ret = await connection.select().from('*').table('clientes').where(email, senha).limit(limit).offset((page - 1) * limit);
    return this.res.status(200).json({ ret, success: true, error: false });
  }

}
