const users = [];

//join users to chat
function userJoin(id, username, room) {
  let user = {
    id,
    username,
    room,
  };

  users.push(user);

  return user;
}

//get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//handling user leaving chat

function userLeft(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeft,
  getRoomUsers,
};
