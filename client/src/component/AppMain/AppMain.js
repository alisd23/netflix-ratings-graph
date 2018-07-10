import React, { Component } from 'react';
import { TabList, Tabs, TabPanel, Tab } from 'react-tabs';

import Recommendations from '../Recommendations';

import './AppMain.scss';

class AppMain extends Component {
  render() {
    return (
      <Tabs className="app-main">
        <TabList>
          <Tab>User Graph</Tab>
          <Tab>Recommendations</Tab>
        </TabList>

        <TabPanel className="react-tabs__tab-panel coming-soon">
          <h2>Coming Soon</h2>
        </TabPanel>
        <TabPanel>
          <Recommendations />
        </TabPanel>
      </Tabs>
    )
  }
}

export default AppMain;
