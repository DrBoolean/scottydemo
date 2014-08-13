module.exports = {
  up: function(mig, types, done) {
    mig.createTable('users', {
      id: {type: types.INTEGER, primaryKey: true, autoIncrement: true},
      email: {type: types.STRING, allowNull: false, unique: true},
      first_name: {type: types.STRING, allowNull: false},
      last_name:  {type: types.STRING, allowNull: false},
      avatar: types.STRING,
      salt: {type: types.STRING, allowNull: false},
      encrypted_password: {type: types.STRING, allowNull: false},
      admin: {type: types.BOOLEAN, allowNull: false, defaultValue: false},
    }, {}).ok(function(){
      return mig.addIndex('users', ['email']);
    }).complete(done);
  },
  down: function(mig, types, done) {
    mig.removeIndex('users', ['email']).ok(function(){
      return mig.dropTable('users');
    }).complete(done);
  }
}
