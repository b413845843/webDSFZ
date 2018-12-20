module.exports = (sequelize, DataTypes) => {
  return sequelize.define('friend', {
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