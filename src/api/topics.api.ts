// import { ITopic as ITopic } from '../types/user'

import topics from './topics.json'

// import {
//   authenticatedHeaders,
//   get,
// } from './methods'

export const getTopics = () =>
  Promise.resolve(topics)
