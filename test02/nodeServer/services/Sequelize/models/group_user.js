
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('group_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}