import React, { memo } from 'react'
import styled from '../theme/styled'
import { inject } from 'mobx-react'

// import PropTypes from 'prop-types'

import SearchInput from './SearchInput'

import { ITopic, ISearchTopic } from '../types/topic'
import { TopicStore } from '../stores/TopicStore'

function createSearchItemsList(topics: ITopic[]) {
  return topics.reduce((acc: ISearchTopic[], cur: ITopic) => {
    acc.push({
      key: cur.topic_id,
      text: cur.path,
      breadcrumb: cur.path.split('/'),
      value: cur.topic_id
    })
    if (cur.topics.length > 0) {
      acc.push(...createSearchItemsList(cur.topics))
    }
    return acc
  }, [] as ISearchTopic[])
}

interface IProps {
  className?: string
  id?: string
  value: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  hasError?: boolean
  color?: string
  selected?: boolean
  rounded?: boolean
  topicStore?: TopicStore
  onChange: (val: string) => void
  onSubmit: (form: any) => void
}

const TopicSearchInput = inject('topicStore')(memo((props: IProps) => {
  const {
    className, id, value, placeholder, disabled, required, selected,
    hasError, onChange, onSubmit, topicStore
  } = props
  const searchItems = createSearchItemsList(topicStore!.topics)
  const handleSearchItemClick = (result: ISearchTopic) => (e: any) => {
    onChange(result.text)
  }
  function renderSearchResult(result: ISearchTopic) {
    return <SearchResult onClick={handleSearchItemClick(result)}>{result.text}</SearchResult>
  }
  return (
    <SearchInput
      className={className}
      id={id}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      hasError={hasError}
      onChange={onChange}
      onSubmit={onSubmit}
      resultIsLink={false}
      rounded={false}
      searchIcon={false}
      selected={selected}
      searchItems={searchItems}
      searchOptions={{threshold: 0.3, keys: ['text', 'breadcrumb'], maxPatternLength: 32 }}
      renderSearchResult={renderSearchResult}
      shownSearchResults={20}
    />
  )
}))

const SearchResult = styled.button`
  background: transparent;
  border: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: start;
  width: 100%;
`

// TopicSearchInput.propTypes = {
//   id: PropTypes.string,
//   placeholder: PropTypes.string,
//   hasError: PropTypes.bool,
//   disabled: PropTypes.bool,
//   required: PropTypes.bool,
//   allTopics: PropTypes.arrayOf(PropTypes.object).isRequired,
//   onChange: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
// };

// TopicSearchInput.defaultProps = {
//   placeholder: "Valitse aihealue",
//   required: false,
//   disabled: false,
// }

export default TopicSearchInput
