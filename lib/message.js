'use strict'

// Gives back the entity value of the given entity label in the given message
// If no entity, @returns null
exports.getEntity = (message, wantedEntity) =>
  message.entities.hasOwnProperty(wantedEntity) ? message.entities[wantedEntity][0] : null
// Check is the messahe has the given entity
exports.messageHasEntity = (message, wantedEntity) => getMessageEntity(message, wantedEntity) === null ? false : true
