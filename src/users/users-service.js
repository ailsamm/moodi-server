const UsersService = {
    getAllUsers(knex) {
      return knex.select('*').from('moodi_users')
    },
    insertUser(knex, newUser){
      return knex
          .insert(newUser)
          .into('moodi_users')
          .returning('*')
          .then(rows => {
            return rows[0]
      })
    },
    deleteUser(knex, id){
      return knex('moodi_users')
          .where({ id })
          .delete()
    },
    getById(knex, id){
      return knex
        .from('moodi_users')
        .select('*')
        .where({ id })
        .first()
    },
    updateUser(knex, id, newUserFields) {
      return knex('moodi_users')
        .where({ id })
        .update(newUserFields)
    }
  }
  
  module.exports = UsersService;