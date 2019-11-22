import React, { memo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import TopicSearchInput from '../components/TopicSearchInput'
import OldTopicSearchInput from '../components/OldTopicSearchInput'

import { Stores } from '../stores'
import { TopicStore } from '../stores/TopicStore'

import { ISearchTopic } from '../types/topic'

interface IProps {
  topicStore?: TopicStore,
}

@inject((stores: Stores) => ({
  topicStore: stores.topicStore,
}))
@observer
export class FrontPage extends React.PureComponent<IProps> {
  componentDidMount() {
    this.props.topicStore!.getTopics()
  }
  render() {
    return (
      <Container>
        <a href="https://github.com/TeemuKoivisto/search-demo-app"><h1>Search demo app</h1></a>
        <SearchForm />
      </Container>
    )
  }
}

const Container = styled.div`
`

const SearchForm = memo((props: {}) => {
  const [topic, setTopic] = useState('')
  const [topicId, setTopicId] = useState(-1)

  function getTopicError() {
    if (topic.length === 0 || topicId === -1) {
      return 'Valitse aihealue.'
    }
    return ''
  }
  function handleTopicChange(val: string) {
    setTopic(val)
    setTopicId(-1)
  }
  function handleTopicSelect(val: ISearchTopic) {
    setTopic(val.text)
    setTopicId(val.value)
    return val.text
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>New, working version</h2>
      <TopicSearchInput
        id="thread-topic"
        placeholder="Kirjoita aihealue"
        required
        hasError={getTopicError().length !== 0}
        value={topic}
        selected={topicId !== -1}
        onChange={handleTopicChange}
        onSubmit={handleTopicSelect}
      />
      <h2>Old, crappy one</h2>
      <OldTopicSearchInput
        id="thread-topic"
        placeholder="Kirjoita aihealue"
        required
        hasError={getTopicError().length !== 0}
        value={topic}
        selected={topicId !== -1}
        onChange={handleTopicChange}
        onSubmit={handleTopicSelect}
      />
    </form>
  )
})
