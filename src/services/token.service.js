import { logger } from "../utils/logger.js";
import TokenDaoMongoDB from "../dao/mongodb/managers/token.dao.js";
const tokenDao = new TokenDaoMongoDB()

export const getAllTokensService = async () => {
  try {
    const response = await tokenDao.getAllTokens()
    return response;
  } catch (error) {
    logger.error(error.message)
  }
}

export const getTokenByIdService = async (id) => {
    try {
      const response = await tokenDao.getTokenById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const getTokenByUserService = async (user) => {
    try {
      const response = await tokenDao.getTokenByUser(user);
      return response
    } catch (error) {
      logger.error(error.message)
    }
  }

export const disableTokenService = async (id) => {
    try {
      const response = await tokenDao.disableToken(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const getTokenByHashService = async (hash) => {
    try {
      const response = await tokenDao.getTokenByHash(hash);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const createTokenService = async (obj) => {
    try {
      const response = await tokenDao.createToken(obj);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const deleteTokenByIdService = async (id) => {
    try {
      const response = await tokenDao.deleteToken(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const deleteAllTokensService = async () => {
  try {
    const response = await tokenDao.deleteAllTokens();
    return response;
  } catch (error) {
    logger.error(error.message)
  }
}