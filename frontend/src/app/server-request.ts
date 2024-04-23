import { useState } from 'react';
import { useEffect } from 'react';
import { User } from '../interfaces/user';
import { Excersise } from '../interfaces/excersise';

const ServerRequestService = () => {
  const link = "https://dlmc73-8000.csb.app";

  const makeRequest = async (method: string, endpoint: string, data = {}) => {
    const response = await fetch(`${link}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'credentials': 'include'
      },
      body: JSON.stringify(data),
      credentials: "include"
    });

    return response.json();
  };

  // FOR USERS
  const register = async (user: User): Promise<any> => {
    return await makeRequest('POST', '/register', user);
  };

  const login = async (user: User): Promise<any> => {
    return await makeRequest('POST', '/login', user);
  };

  const authentication = async (): Promise<any> => {
    return await makeRequest('GET', '/user/authenticate');
  };

  const logout = async (): Promise<any> => {
    return await makeRequest('POST', '/logout');
  };

  // FOR FRIENDS
  const searchFriends = async (nickName: string): Promise<any> => {
    return await makeRequest('POST', '/getPotentialFriends', { nickName });
  };

  const sendFriendRequest = async (nickName: string): Promise<any> => {
    return await makeRequest('POST', '/sendFriendRequest', { nickName });
  };

  const getFriendRequests = async (): Promise<any> => {
    return await makeRequest('POST', '/getFriendRequests');
  };

  const cancelFriendRequest = async (nickName: string, sent: boolean): Promise<any> => {
    return await makeRequest('POST', '/cancelFriendRequest', { nickName, sent });
  };

  const acceptFriendRequest = async (nickName: string): Promise<any> => {
    return await makeRequest('POST', '/acceptFriendRequest', { nickName });
  };

  // FOR EXCERSISES
  const addExcersise = async (excersise: Excersise): Promise<any> => {
    return await makeRequest('POST', '/excersise/add', excersise);
  };

  const getExcersises = async (): Promise<any> => {
    return await makeRequest('GET', '/excersise');
  };

  // FOR ADMIN
  const loginAdmin = async (object: any): Promise<any> => {
    return await makeRequest('POST', '/admin/login', object);
  };

  const adminAuthentication = async (): Promise<any> => {
    return await makeRequest('GET', '/admin/authenticate');
  };

  return {
    register,
    login,
    authentication,
    logout,
    searchFriends,
    sendFriendRequest,
    getFriendRequests,
    cancelFriendRequest,
    acceptFriendRequest,
    addExcersise,
    getExcersises,
    loginAdmin,
    adminAuthentication
  };
};

export default ServerRequestService;
