import React, { memo, useRef, useState, ReactNode } from 'react'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import { FiSearch } from 'react-icons/fi'
import InfiniteScroll from 'react-infinite-scroll-component'
import debounce from 'lodash/debounce'

import Fuse from 'fuse.js'

import {Input} from '../elements/Input'

import useClickOutside from '../hooks/useClickOutside'
import { ITheme } from '../types/theme'
import { ISearchTopic } from '../types/topic'

interface IProps {
  className?: string
  id?: string
  value: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  hasError?: boolean
  color?: string
  dataAttrBase?: string
  searchItems: any[]
  searchOptions: any
  selected?: boolean
  rounded?: boolean
  searchIcon?: ReactNode
  resultIsLink?: boolean
  renderSearchResult: (result: ISearchTopic) => ReactNode
  shownSearchResults: number
  onChange: (val: string) => void
  onSubmit: (form: any) => void
}

const SearchInputEl = memo((props: IProps) => {
  const {
    className, id, value, placeholder, disabled, required, hasError,
    color, dataAttrBase, searchItems, searchOptions, selected, rounded, searchIcon,
    resultIsLink, renderSearchResult, shownSearchResults, onChange, onSubmit
  } = props
  const [searchResults, setSearchResults] = useState([] as ISearchTopic[])
  const [shownResults, setShownResults] = useState(shownSearchResults)
  const [hasMoreResults, setHasMoreResults] = useState(false)
  const ref = useRef(null)
  const [resultsVisible, setResultsVisible] = useState(false)
  useClickOutside(ref, () => hideResults(), resultsVisible)
  // https://fusejs.io/
  // fuse.js is a fuzzy-search library which is helpful when user makes typos etc
  const fuse = new Fuse(searchItems || [], searchOptions || {})
  const debouncedSearch = debounce(handleSearch, 250)

  function hideResults() {
    setResultsVisible(false)
  }
  function handleKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      onSubmit(searchResults[0])
      hideResults()
    }
  }
  function handleChange(newVal: string) {
    onChange(newVal)
    debouncedSearch(newVal)
  }
  function handleSearch(newVal: string) {
    const deletedText = newVal.length < value.length
    // Reset the shownResults amount to the default
    // Dunno if this is the perfect flow but it seems all right
    if (deletedText) {
      setShownResults(shownSearchResults)
    }
    // If searchItems were provided and there exists results
    if (searchItems && searchItems.length > 0) {
      console.time('search')
      const newResults = fuse.search(newVal) as ISearchTopic[]
      console.log(newResults)
      console.timeEnd('search')
      setSearchResults(newResults)
      // If there is new results less than shownResults, show the "Näytä lisää" at the end of the list
      if (shownResults < newResults.length) {
        setHasMoreResults(true)
      } else {
        setHasMoreResults(false)
      }
    }
  }
  function handleShowMoreResults() {
    const newShownResults = shownResults + shownSearchResults
    setShownResults(newShownResults)
    if (newShownResults >= searchResults.length) {
      setHasMoreResults(false)
    }
  }
  function handleResultItemClick(item: any) {
    // Prevents onClick from transitioning if result was link that was opened to eg new tab
    if (!resultIsLink) {
      onSubmit(item)
      hideResults()
    }
  }
  function handleSearchIconClick() {
    onSubmit(searchResults[0])
    hideResults()
  }
  console.log(resultsVisible)
  return (
    <div className={className} ref={ref}>
      <SearchWrapper
        color={color}
        hasError={hasError}
        rounded={rounded}
      >
        <StyledInput
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          hasError={hasError}
          fullWidth
          autocomplete="off"
          color={color}
          selected={selected}
          rounded={rounded}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setResultsVisible(true)}
        />
        { searchIcon && <SearchButton
          color={color}
          rounded={rounded}
          data-gtm-label={dataAttrBase ? `btn-search-${dataAttrBase}` : null}
          onClick={handleSearchIconClick}
        >
          <IconWrapper color={color}>
            <SearchIcon size={18} />
          </IconWrapper>
        </SearchButton>
        }
      </SearchWrapper>
      <ResultsList visible={resultsVisible}>
        <InfiniteScroll
          className="infinite-scroll"
          dataLength={shownResults}
          next={handleShowMoreResults}
          hasMore={hasMoreResults}
          loader={<h4>Lataa aiheita..</h4>}
          height={300}
          endMessage={ searchResults.length !== 0 &&
            <ResultItem className="end-of-results">
            </ResultItem>}
        >
          { searchResults.slice(0, shownResults).map((r, i) =>
          <ResultItem key={r.key} onClick={() => handleResultItemClick(r)}>
            {renderSearchResult(r)}
          </ResultItem>
          )}
        </InfiniteScroll>
      </ResultsList>
    </div>
  )
})

function borderColor(props: { color?: string, hasError?: boolean, theme: ITheme}) {
  const { color, hasError, theme } = props
  if (hasError) return theme.color.red
  if (color === 'green') return theme.color.green
  return theme.color.grayLight
}
const SearchWrapper = styled.div<{ color?: string, rounded?: boolean, hasError?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ color, theme }) => color === 'white' ? '#fff' : theme.color.green};
  border: 1px solid ${(props) => borderColor(props)};
  border-radius: ${({ rounded }) => rounded ? '26px' : '4px'};
  justify-content: space-between;
  &:hover, &:active, &:focus {
    border-color: #40a9ff;
  }
`
const StyledInput = styled(Input)<{ rounded?: boolean, selected?: boolean }>`
  border: 0;
  // Eliminate awkward empty space before the input text
  margin-left: ${({ rounded }) => rounded && '11px'};
  & > input {
    border: 0;
    outline: 0;
    // Same empty space thing. Total 14px matches Input's left padding
    padding-left: ${({ rounded }) => rounded && '3px'};
    text-decoration: ${({ selected }) => selected && 'underline'};
  }
`
const SearchButton = styled.button<{ rounded?: boolean }>`
  background: transparent;
  border: none;
  border-top-right-radius: ${({ rounded }) => rounded ? '26px' : '4px'};
  border-bottom-right-radius: ${({ rounded }) => rounded ? '26px' : '4px'};
  cursor: pointer;
  padding: 7px 16px;
  outline: none;
  &:hover {
    background-color: ${({ color, theme }) => color === 'white' ? theme.grayLightest : theme.color.green};
    border-left: 1px solid ${({ theme }) => theme.color.grayLight};
  }
`
const IconWrapper = styled.div`
  display: flex; // Center the search icon
  height: 18px;
  color: ${({ color, theme }) => color === 'white' ? theme.color.textLight : '#fff'};
`
const SearchIcon = styled(FiSearch)`
  vertical-align: middle;
`
const SvgWrapper = styled.span`
  align-items: center;
  display: flex;
`
const ResultsList = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'block' : 'none'};
  height: 300px;
  position: absolute;
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  width: 100%;
  z-index: 10;
  .infinite-scroll {
    margin: 0 15px 0 15px;
    &::-webkit-scrollbar {
      background: ${({ theme }) => theme.color.grayLight};
      height: 8px;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.color.gray};
    }
  }
`
const ResultItem = styled.div`
  background: #fff;
  border-bottom: 1px solid #e2e2e2;
  border-left: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
  box-shadow: 1px 1px #b5b5b570;
  cursor: pointer;
  display: flex;
  padding: 5px 15px;
  &:hover {
    background: #f2f2f2;
  }
  &.end-of-results {
    height: 5px;
    &:hover {
      background: #fff;
    }
    & > ${SvgWrapper} {
      margin-right: 15px;
    }
  }
`
const SearchInput = styled(SearchInputEl)`
  position: relative;
`

// SearchInput.propTypes = {
//   id: PropTypes.string,
//   placeholder: PropTypes.string,
//   hasError: PropTypes.bool,
//   disabled: PropTypes.bool,
//   required: PropTypes.bool,
//   color: PropTypes.oneOf(['white', 'green']),
//   dataAttrBase: PropTypes.string,
//   searchItems: PropTypes.arrayOf(PropTypes.object),
//   searchOptions: PropTypes.object,
//   selected: PropTypes.bool,
//   rounded: PropTypes.bool.isRequired,
//   searchIcon: PropTypes.bool.isRequired,
//   resultIsLink: PropTypes.bool,
//   renderSearchResult: PropTypes.func.isRequired,
//   shownSearchResults: PropTypes.number.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

SearchInput.defaultProps = {
  color: 'white',
  placeholder: 'Etsi',
  resultIsLink: false,
  selected: false,
  rounded: true,
  searchIcon: true,
  shownSearchResults: 10,
};

export default SearchInput
