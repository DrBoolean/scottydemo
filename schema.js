module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    encrypted_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {isEmail: {msg: 'Must provide a valid email address'}},
      set: function(email){
        return this.setDataValue('email', email.toLowerCase());
      }
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },{
    timestamps: false,
    freezeTableName: true,
    underscored: true,
  });


  return {users: users};
}

