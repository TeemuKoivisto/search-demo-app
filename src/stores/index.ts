import { TopicStore } from './TopicStore'
import { ToastStore } from './ToastStore'

export class Stores {
  topicStore: TopicStore
  toastStore: ToastStore

  constructor() {
    this.topicStore = new TopicStore()
    this.toastStore = new ToastStore()
  }
}
