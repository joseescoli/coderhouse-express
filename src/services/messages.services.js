import MessagesDaoMongoDB from "../dao/mongodb/managers/messages.dao.js"
const msgDao = new MessagesDaoMongoDB();

export const getAllService = async () => {
  try {
    const response = await msgDao.getAllMessages();
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const getByIdService = async (id) => {
  try {
    const response = await msgDao.getMessageById(id);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const createService = async (obj) => {
  try {
    const message = {}
    message.user = obj.username
    message.message = obj.message
    const response = await msgDao.createMessage(message);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const updateService = async (id, obj) => {
  try {
    await msgDao.updateMessage(id, obj);
    return obj;
  } catch (error) {
    console.log(error);
  }
}

export const deleteByIdService = async (id) => {
  try {
    const response = await msgDao.deleteMessage(id);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const deleteAllService = async () => {
try {
  const response = await msgDao.deleteAllProducts();
  return response;
} catch (error) {
  console.log(error);
}

}