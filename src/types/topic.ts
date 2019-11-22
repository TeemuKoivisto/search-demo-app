export interface ITopic {
  topic_id: number
  path: string
  title: string
  is_visible: boolean
  is_hidden: boolean
  is_adultonly: boolean
  priority: number
  topics: ITopic[]
}

export interface ISearchTopic {
  key: number
  text: string
  breadcrumb: string[]
  value: number
}
