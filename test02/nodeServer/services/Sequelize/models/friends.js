module.exports = (sequelize, DataTypes) => {
  return sequelize.define('friendship', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}