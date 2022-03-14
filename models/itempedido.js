'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemPedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ItemPedido.belongsTo(models.Pedido, {foreignKey: 'PedidoId', as: 'pedido_item'});
      ItemPedido.belongsTo(models.Servico, {foreignKey: 'ServicoId', as: 'servico_item'});

    }
  }
  ItemPedido.init({
    quantidade: DataTypes.INTEGER,
    valor: DataTypes.FLOAT,
    PedidoId: DataTypes.INTEGER,
    ServicoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ItemPedido',
  });
  return ItemPedido;
};