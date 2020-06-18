const path = require('path');
const express = require('express');
const xss = require('xss');
const moodLogsService = require('./mood-logs-service');
const moodLogsRouter = express.Router();
const jsonParser = express.json();

// protects mood log against XSS attacks
const serializeMoodLog = moodLog => ({
  id: moodLog.id,
  user_id: moodLog.user_id,
  mood: xss(moodLog.mood),
  activities: xss(moodLog.activities),
  notes: xss(moodLog.notes),
  title: xss(moodLog.title),
  start_date: xss(moodLog.start_date),
  end_date: xss(moodLog.end_date),
  sleep_hours: moodLog.sleep_hours
});

moodLogsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    moodLogsService.getAllMoodLogs(knexInstance)
      .then(moodLogs => {
        res.json(moodLogs.map(serializeMoodLog));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, mood, activities, notes, title, start_date, end_date, sleep_hours } = req.body;
    const newMoodLog = { user_id, mood, activities, notes, title, start_date, end_date, sleep_hours };

    // check that all required fields are present
    for (const [key, value] of Object.entries({ user_id, mood, activities, notes, title, start_date, end_date, sleep_hours })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    moodLogsService.insertMoodLog(
      req.app.get('db'),
      newMoodLog
    )
      .then(moodLog => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${moodLog.id}`))
          .json(serializeMoodLog(moodLog))
      })
      .catch(next);
  })

  moodLogsRouter
  .route('/:moodLog_id')
  .all((req, res, next) => {
    // checks if requested mood log exists
    moodLogsService.getById(
      req.app.get('db'),
      req.params.moodLog_id
    )
      .then(moodLog => {
        if (!moodLog) {
          return res.status(404).json({
            error: { message: `Mood log doesn't exist` }
          });
        }
        res.moodLog = moodLog;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeMoodLog(res.moodLog));
  })
  .delete((req, res, next) => {
    moodLogsService.deleteMoodLog(
      req.app.get('db'),
      req.params.moodLog_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    // updates only provided fields
    const { mood, activities, notes, title, start_date, end_date, sleep_hours } = req.body;
    const moodLogToUpdate = { mood, activities, notes, title, start_date, end_date, sleep_hours };

    const numberOfValues = Object.values(moodLogToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain at least either 'mood', 'activities', 'notes', 'title', 'start_date', 'end_date' or 'sleep_hours'`
        }
      });

    moodLogsService.updateMoodLog(
      req.app.get('db'),
      req.params.moodLog_id,
      moodLogToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })

module.exports = moodLogsRouter;