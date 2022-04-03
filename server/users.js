const users = [];

const addUser = ({ id, name, sessionid }) => {
  name = name.trim().toLowerCase();
  sessionid = sessionid.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.sessionid === sessionid && user.name === name
  );

  if (!name || !sessionid)
    return { error: "Username and sessionid are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, sessionid };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInsessionid = (sessionid) =>
  users.filter((user) => user.sessionid === sessionid);

module.exports = { addUser, removeUser, getUser, getUsersInsessionid };
