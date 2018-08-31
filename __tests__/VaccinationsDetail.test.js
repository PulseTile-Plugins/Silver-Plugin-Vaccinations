import React from 'react';
import Enzyme, { shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { get } from 'lodash';

import VaccinationDetail from '../VaccinationDetail/VaccinationDetail';
import { themeConfigs } from '../../../../../themes.config';
import { valuesNames, valuesLabels } from '../forms.config';
import {getDDMMMYYYY} from '../../../../../utils/time-helpers.utils';
import { isShowElement } from '../../../../../utils/themeSettings-helper';

Enzyme.configure({ adapter: new Adapter() });

const VACCINATIONS_PANEL = 'vaccinationsPanel';
const VACCINATIONS_DETAIL_TITLE = 'Vaccination';
const VACCINATIONS_DETAIL_EDIT_TITLE = 'Edit Vaccination';

const hideElements = get(themeConfigs, 'detailsToHide.vaccinations', []);

const testProps = {
  onExpand: () => {},
  onEdit: () => {},
  onCancel: () => {},
  onSaveSettings: () => {},
  openedPanel: {},
  expandedPanel: 'all',
  currentPanel: 'currentPanel',
  editedPanel: 'editedPanel',
  vaccinationPanelFormValues: {},
};

const detail = {
  [valuesNames.NAME]: '1',
  [valuesNames.COMMENT]: 'twest',
  [valuesNames.SERIES_NUMBER]: '1',
  [valuesNames.SOURCE]: 'ethercis',
  [valuesNames.SOURCE_ID]: 'b9ececa8-4e84-4229-8ee3-1fa0bc8519a2',
  [valuesNames.DATE_TIME]: 1510437600000,
  [valuesNames.DATE]: 1511434248000,
  [valuesNames.AUTHOR]: 'Dr Tony Shannon',
};

const CONVERT_DATE_TIME = getDDMMMYYYY(detail[valuesNames.DATE_TIME]);
const CONVERT_DATE = getDDMMMYYYY(detail[valuesNames.DATE]);

describe('Component <VaccinationDetail />', () => {
  it('should renders with all props correctly', () => {
    const component = shallow(
      <VaccinationDetail
        detail={detail}
        onExpand={testProps.onExpand}
        onEdit={testProps.onEdit}
        onCancel={testProps.onCancel}
        onSaveSettings={testProps.onSaveSettings}
        openedPanel={testProps.openedPanel}
        expandedPanel={testProps.expandedPanel}
        currentPanel={testProps.currentPanel}
        editedPanel={testProps.editedPanel}
        vaccinationPanelFormValues={testProps.vaccinationPanelFormValues}
        isSubmit={false}
      />
    );

    expect(component).toMatchSnapshot();

    // Testing component when detail filled object, expandedPanel is all, and panel not edited
    expect(component.instance().props['detail']).toEqual(detail);
    expect(component.instance().props['onExpand']).toEqual(testProps.onExpand);
    expect(component.instance().props['onEdit']).toEqual(testProps.onEdit);
    expect(component.instance().props['onCancel']).toEqual(testProps.onCancel);
    expect(component.instance().props['onSaveSettings']).toEqual(testProps.onSaveSettings);
    expect(component.instance().props['openedPanel']).toEqual(testProps.openedPanel);
    expect(component.instance().props['expandedPanel']).toEqual(testProps.expandedPanel);
    expect(component.instance().props['currentPanel']).toEqual(testProps.currentPanel);
    expect(component.instance().props['editedPanel']).toEqual(testProps.editedPanel);
    expect(component.instance().props['vaccinationPanelFormValues']).toEqual(testProps.vaccinationPanelFormValues);
    expect(component.instance().props['isSubmit']).toEqual(false);

    expect(component.find('.section-detail')).toHaveLength(1);
    expect(component.find('.form')).toHaveLength(2);
    expect(component.find('PluginDetailPanel')).toHaveLength(2);

    expect(component.find('PluginDetailPanel').at(0).props().currentPanel).toEqual(testProps.currentPanel);
    expect(component.find('PluginDetailPanel').at(0).props().editedPanel).toEqual(testProps.editedPanel);
    expect(component.find('PluginDetailPanel').at(0).props().isBtnShowPanel).toEqual(true);
    expect(component.find('PluginDetailPanel').at(0).props().isOpen).toEqual(testProps.editedPanel === VACCINATIONS_PANEL);
    expect(component.find('PluginDetailPanel').at(0).props().name).toEqual(VACCINATIONS_PANEL);
    expect(component.find('PluginDetailPanel').at(0).props().onCancel).toEqual(testProps.onCancel);
    expect(component.find('PluginDetailPanel').at(0).props().onEdit).toEqual(testProps.onEdit);
    expect(component.find('PluginDetailPanel').at(0).props().onExpand).toEqual(testProps.onExpand);
    expect(component.find('PluginDetailPanel').at(0).props().onSaveSettings).toEqual(testProps.onSaveSettings);
    expect(component.find('PluginDetailPanel').at(0).props().title).toEqual(VACCINATIONS_DETAIL_TITLE);

    let count = 0;
    if (isShowElement(valuesNames.NAME, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.NAME);
      expect(component.find('.form-control-static').at(count).text()).toEqual(detail[valuesNames.NAME]);
      count++;
    }
    if (isShowElement(valuesNames.COMMENT, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.COMMENT);
      expect(component.find('.form-control-static').at(count).text()).toEqual(detail[valuesNames.COMMENT]);
      count++;
    }
    if (isShowElement(valuesNames.DATE_TIME, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.DATE_TIME);
      expect(component.find('.form-control-static').at(count).text()).toEqual(CONVERT_DATE_TIME);
      count++;
    }
    if (isShowElement(valuesNames.SERIES_NUMBER, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.SERIES_NUMBER);
      expect(component.find('.form-control-static').at(count).text()).toEqual(detail[valuesNames.SERIES_NUMBER]);
      count++;
    }
    if (isShowElement(valuesNames.AUTHOR, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.AUTHOR);
      expect(component.find('.form-control-static').at(count).text()).toEqual(detail[valuesNames.AUTHOR]);
      count++;
    }
    if (isShowElement(valuesNames.DATE, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.DATE);
      expect(component.find('.form-control-static').at(count).text()).toEqual(CONVERT_DATE);
      count++;
    }
    if (isShowElement(valuesNames.SOURCE, hideElements)) {
      expect(component.find('.control-label').at(count).text()).toEqual(valuesLabels.SOURCE);
      expect(component.find('.form-control-static').at(count).text()).toEqual(detail[valuesNames.SOURCE]);
    }

  });

  it('should renders correctly with different state of props', () => {
    const component = shallow(
      <VaccinationDetail
        expandedPanel={'all'}
        editedPanel={{ [VACCINATIONS_PANEL]: true }}
        openedPanel={{ [VACCINATIONS_PANEL]: true }}
      />
    );
    expect(component).toMatchSnapshot();

    // Testing component when detail filled object, expandedPanel is all, and panel is edited
    component.setProps({ detail: detail });
    expect(component).toMatchSnapshot();

    expect(component.find('PluginDetailPanel')).toHaveLength(2);
    expect(component.find('ReduxForm')).toHaveLength(1);
    expect(component.find('PluginDetailPanel').at(0).props().title).toEqual(VACCINATIONS_DETAIL_EDIT_TITLE);
  });
});

