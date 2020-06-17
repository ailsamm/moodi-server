const MoodLogsService = {
    getAllMoodLogs(knex) {
      return knex.select('*').from('moodi_mood_logs')
    },
    insertMoodLog(knex, newUser){
      return knex
          .insert(newUser)
          .into('moodi_mood_logs')
          .returning('*')
          .then(rows => {
            return rows[0]
      })
    },
    deleteMoodLog(knex, id){
      return knex('moodi_mood_logs')
          .where({ id })
          .delete()
    },
    getById(knex, id){
      return knex
        .from('moodi_mood_logs')
        .select('*')
        .where({ id })
        .first()
    },
    updateMoodLog(knex, id, newUserFields) {
      return knex('moodi_mood_logs')
        .where({ id })
        .update(newUserFields)
    }
  }
  
  module.exports = MoodLogsService;