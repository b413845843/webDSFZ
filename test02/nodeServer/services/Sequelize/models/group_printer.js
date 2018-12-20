module.exports = (sequelize, DataTypes) => {
  return sequelize.define('group_printer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}