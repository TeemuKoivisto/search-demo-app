import { action, runInAction, observable } from 'mobx'
import * as topicApi from '../api/topics.api'

import { ITopic } from '../types/topic'

export class TopicStore {
  @observable topics: ITopic[] = []
  @observable loading = false

  @action
  getTopics = async () => {
    this.loading = true
    const result = await topicApi.getTopics() as ITopic[]
    runInAction(() => {
      console.log(result)
      this.topics = result
      this.loading = false
    })
  }
}
