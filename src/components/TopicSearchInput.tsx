import React, { memo, useEffect, useState } from 'react'
import styled from '../theme/styled'
import { inject } from 'mobx-react'

// import PropTypes from 'prop-types'
import Fuse from 'fuse.js'

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

function findTopicsByBreadcrumb(topics: ISearchTopic[], crumb: string[]) {
  const t = topics.reduce((acc: ISearchTopic[], cur: ISearchTopic) => {
    if (isEqualBreadcrumb(cur.breadcrumb, crumb, cur.breadcrumb.length - 1)) {
      acc.push({
        key: cur.key,
        text: cur.text,
        breadcrumb: cur.breadcrumb,
        value: cur.value
      })
    }
    return acc
  }, [] as ISearchTopic[])
  return sortSearchResultsByCrumb(t)
}

function isEqualBreadcrumb(crumb1: string[], crumb2: string[], fromStart: number) {
  const to = fromStart
  if (fromStart === undefined && crumb1.length !== crumb2.length) {
    return false
  }
  let equal = true
  for(let i = 0; i < to; i++) {
    if (crumb1[i] !== crumb2[i]) equal = false
  }
  return equal
}

function sortSearchResultsByCrumb(topics: ISearchTopic[]) {
  return topics.sort((a, b) => {
    if (a.breadcrumb.length === b.breadcrumb.length) {
      // fuzzy search the text? or not, it's good enough
      return 0
    }
    return b.breadcrumb.length - a.breadcrumb.length
  })
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
  onSubmit: (item: ISearchTopic) => string
}

const TopicSearchInput = inject('topicStore')(memo((props: IProps) => {
  const {
    className, id, value, placeholder, disabled, required, selected,
    hasError, onChange, onSubmit, topicStore
  } = props

  const [searchItems, setSearchItems] = useState([] as ISearchTopic[])
  // https://fusejs.io/
  // fuse.js is a fuzzy-search library which is helpful when user makes typos etc
  const [fuse, setFuse] = useState(new Fuse(searchItems, {
    threshold: 0.2, keys: ['text'], tokenize: true, maxPatternLength: 100
  }))

  useEffect(() => {
    const newItems = createSearchItemsList(topicStore!.topics)
    setSearchItems(newItems)
    setFuse(new Fuse(newItems, {
      threshold: 0.2, keys: ['text'], tokenize: true, maxPatternLength: 100
    }))
  }, [topicStore!.topics])

  const handleSearchItemClick = (result: ISearchTopic) => (e: any) => {
    onChange(result.text)
  }
  function handleSearch(newVal: string, prevVal: string) {
    const crumbs = newVal.split('/').slice(0, -1)
    if (crumbs.length === 0) {
      return fuse.search(newVal) as ISearchTopic[]
    }
    return findTopicsByBreadcrumb(searchItems, crumbs)
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
      onSearch={handleSearch}
      onSubmit={onSubmit}
      resultIsLink={false}
      rounded={false}
      searchIcon={false}
      selected={selected}
      searchItems={searchItems}
      renderSearchResult={renderSearchResult}
      shownSearchResults={200}
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
