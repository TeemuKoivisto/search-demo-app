import * as React from 'react'
// import * as ReactDOM from 'react-dom'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'

import { FrontPage } from '../FrontPage'

import { Stores } from '../../stores'
import { confMobx } from '../../stores/mobxConf'

import { AuthStore } from '../../stores/AuthStore'

confMobx()

describe('FrontPage', () => {
  let FrontPageEl: JSX.Element
  let authStore: AuthStore
  let stores: Stores

  beforeAll(() => {
    // authStore = new AuthStore()
    stores = new Stores()
    FrontPageEl = (
      <Provider {...stores}>
        <FrontPage/>
      </Provider>
    )
  })

  it('should render FrontPage without crashing', () => {
    const wrapper = mount(FrontPageEl)

    expect(wrapper.find(FrontPage)).toEqual(1)
  })
})
// it('renders without crashing', () => {
//   const div = document.createElement('div')
//   ReactDOM.render(<FrontPage authStore={authStore}/>, div)
//   ReactDOM.unmountComponentAtNode(div)
// })
