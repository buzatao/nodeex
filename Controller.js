const express = require('express');
const cors = require('cors');

const models= require('./models');
const { Sequelize } = require('./models');
const res = require('express/lib/response');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;


app.get('/', function(req,res){
    res.send('ola mundo');
})     
//cria servico
app.post('/servicos', async(req, res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Servico criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Impossivel se conectar."
        })
    });
});
//lista todos servicos
app.get('/listaservicos', async(req, res) =>{
    await servico.findAll({
        raw: true
    }).then(function(servicos){
        res.json({servicos})
    })
})
//atualiza servico
app.put('/atualizarservico', async(req, res) =>{
    await servico.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Dados alterados com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Falha ao alterar o servico."
        })
    })
})

//cria cliente
app.post('/clientes', async(req,res) =>{
    await cliente.create(
        req.body
    ).then(cli => {
        return res.json({
            error: false,
            message: "Cliente criado com sucesso!",
            cli
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            messagem: "Problema de conexão"
        });
    }); 
})
//cria pedido relacionado a cliente
app.post('/clientes/:id/pedido', async (req, res)=> {
    const ped = {
        data: req.body.data,
        ClienteId: req.params.id
    };
    if(! await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            messagem: "Cliente não existe!"
        });
    }
    await pedido.create(ped)
    .then(pedcli => {
        return res.json({
            error: false,
            message: "Pedido foi inserido com sucesso.",
            pedcli
        });
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })

});
//consulta clientes;
app.get('/clientes', async(req,res)=>{
    await cliente.findAll()
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})

//consulta todos os pedidos relacionados a clientes
app.get('/clientes-pedidos', async(req,res) =>{
    await cliente.findAll({include : [{all: true}]})
    .then(cli =>{
        return res.json({
            error: false,
            cli
        });
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})

//consulta para exibir os pedidos de um cliente especifico
app.get('/cliente/:id/pedidos', async(req,res) =>{
    await pedido.findAll({
        where: {ClienteId: req.params.id}    //requisicao passada por parametros que é o ID
    }).then(pedidos =>{
        return res.json({
            error: false,
            pedidos
        });
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})

//obter o pedido
app.get('/pedido/:id', async(req,res)=>{
    await pedido.findByPk(req.params.id)
    .then(ped =>{
        return res.json({
            error: false,
            ped
        });
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})

//alterar pedido (deve-se informar o id do pedido)
app.put('/pedido/:id', async(req,res) =>{
    const ped = {
        id : req.params.id,
        ClienteId :req.body.ClienteId,
        data : req.body.data
    };
    if(! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe."      
        })
    }
    await pedido.update(ped, {
        where : Sequelize.and({ClienteId : req.body.ClienteId} , {id: req.params.id})
    }).then(pedidos => {
        return res.json({
            error: false,
            message: "Alterado com sucesso!",
            pedidos
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            messagem: "Problema de conexão"
        });
    }); 
})
//tudo pedidos
app.get('/tudodeumpedidos/:id', async(req,res) =>{
    await pedido.findByPk(req.params.id,{include: [{all: true}]})
    .then(ped =>{
        return res.json({ped})
    })
})

//item pedido 1-2-3-4
//1
app.post('/itenspedido', async(req, res) =>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item criado!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message: "Impossivel se conectar agr."
        })
    })
})
//2
//3 alterando itempedido;
app.put('/pedidos/:id/editaritem', async(req,res) => {
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    }
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        })
    }
    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: "Servico não foi encontrado."
        })
    }

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId}, {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            itens
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possivel alterar."
        })
    })
})


//1.0criar compra relacionada a cliente; ok
app.post('/cliente/:id/compra', async (req, res) => {
    const comp = {
        data: req.body.data,
        ClienteId: req.params.id
    }
    if(! await cliente.findByPk(req.params.id)){
        return res.status(400).json ({
            error: true,
            message: "Cliente não existe."
        })
    }
    await compra.create(comp)
    .then(compcli => {
        return res.json({
            error:false,
            message: "Compra inserida",
            compcli
        })
    }).catch(error => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexao."
        })
    })
})
//1.1listar todas as compras
app.get('/compras', async(req, res) => {
    await compra.findAll()
    .then(comp => {
        return res.json({
            error: false,
            comp
        })
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})
//1.2listar as compras relacionadas a todos cliente;
app.get('/clientes-compras', async (req, res) => {
    await cliente.findAll({include : [{all: true}]})
    .then(cli => {
        return res.json({
            error: false,
            cli
        })
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})
//1.2.1 listar as compras de 1 cliente;
app.get('/cliente/:id/compras', async(req, res) => {
    await compra.findAll({
        where: {ClienteId: req.params.id}
    }).then(compras => {
        return res.json({
            error: false,
            compras
        })
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})
app.get('/compra/:id', async(req, res) =>{
    await pedido.findByPk(req.params.id)
    .then(comp => {
        return res.json({
            error:false,
            comp
        })
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })
})
//1.3att 
app.put('/compra/:id', async(req, res) =>{
    const comp = {
        id : req.params.id,
        CompraId : req.body.ClienteId,
        data : req.body.data
    }
    if(! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error:true,
            message: "Cliente nao existe."
        })
    }

    await compra.update(comp, {
        where: Sequelize.and({ClienteId: req.body.ClienteId}, {id: req.params.id})
    }).then(compras =>{
        return res.json({
            error: false,
            compras
        });
    }).catch((erro) => {
        return res.status(400).json({
            error:true,
            message: "Problema de conexão" 
        })
    })

})
//e 1.4excluir compra

//criar produto, listar produtos, att produtos e excluir produto;
//cria produto
app.post('/produtos', async(req, res) =>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Produto criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Impossivel se conectar."
        })
    });
});
//lista todos produtos
app.get('/listaprodutos', async(req, res) =>{
    await produto.findAll({
        raw: true
    }).then(function(produtos){
        res.json({produtos})
    })
})
//atualiza produto
app.put('/atualizarproduto', async(req, res) =>{
    await produto.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Produto alterado com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Falha ao alterar o produto."
        })
    })
})



//itemcompra 
//1
app.post('/itenscompra', async(req, res) =>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item criado!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message: "Impossivel se conectar agr."
        })
    })
})
//2
//3 alterando itemCompra;
app.put('/compras/:id/editaritem', async(req,res) => {
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    }
    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Compra não foi encontrado."
        })
    }
    if (!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: "Servico não foi encontrado."
        })
    }

    await itemcompra.update(item, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId}, {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Compra alterada com sucesso!",
            itens
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possivel alterar."
        })
    })
})


//tudo compras
app.get('/tudodeumacompra/:id', async(req,res) =>{
    await compra.findByPk(req.params.id,{include: [{all: true}]})
    .then(comp =>{
        return res.json({comp})
    })
})





let port = process.env.PORT || 3001;

app.listen(port, (req, res)=> {
    console.log('Servidor ativo: http://localhost:3001');
})