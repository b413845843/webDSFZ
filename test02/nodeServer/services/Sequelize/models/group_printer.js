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
    },
    // 权限 0:管理员 1:普通用户
    autho: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}