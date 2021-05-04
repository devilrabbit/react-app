import axios from 'axios';
import mock from '../mocks/$mock';

export const client = axios.create({});
mock(client);
