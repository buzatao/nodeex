'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pedido.belongsTo(models.Cliente, {foreignKey:'ClienteId', as: 'cliente_pedido'});
      Pedido.belongsToMany(models.Servico, {foreignKey: 'ServicoId', through: 'ItemPedido', as: 'servico_pedido'});
      Pedido.hasMany(models.ItemPedido, {foreignKey: 'PedidoId', as: 'item_pedido'});
    }
  }
  Pedido.init({
    data: DataTypes.DATEONLY,
    ClienteId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pedido',
  });
  return Pedido;
};