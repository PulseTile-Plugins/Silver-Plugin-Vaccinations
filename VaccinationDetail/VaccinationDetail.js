import React, { PureComponent } from 'react';
import { get } from 'lodash';

import PluginDetailPanel from '../../../../plugin-page-component/PluginDetailPanel'
import VaccinationDetailForm from './VaccinationDetailForm'
import { getDDMMMYYYY } from '../../../../../utils/time-helpers.utils';
import { valuesNames, valuesLabels } from '../forms.config';
import { themeConfigs } from '../../../../../themes.config';
import { isButtonVisible, isPanelVisible, isShowElement } from '../../../../../utils/themeSettings-helper';

const VACCINATIONS_PANEL = 'vaccinationsPanel';
const SYSTEM_INFO_PANEL = 'systemInformationPanel';

export default class VaccinationDetail extends PureComponent {
  render() {
    const { onExpand, openedPanel, expandedPanel, currentPanel, onShow, onEdit, editedPanel, onCancel, onSaveSettings, vaccinationPanelFormValues, isSubmit } = this.props;
    let { detail } = this.props;
    detail = detail || {};
    const vaccinationDateTime = getDDMMMYYYY(detail[valuesNames.DATE_TIME]);
    const dateCreated = getDDMMMYYYY(detail[valuesNames.DATE]);

    const hiddenButtons = get(themeConfigs, 'buttonsToHide.vaccinations', []);
    const hideElements = get(themeConfigs, 'detailsToHide.vaccinations', []);
    const hiddenPanels = get(themeConfigs, 'panelsToHide.vaccinations', []);

    return (
      <div className="section-detail">
        <div className="panel-group accordion">
          {(expandedPanel === VACCINATIONS_PANEL || expandedPanel === 'all') && !editedPanel[VACCINATIONS_PANEL] ? <PluginDetailPanel
            onExpand={onExpand}
            name={VACCINATIONS_PANEL}
            title="Vaccination"
            isOpen={openedPanel === VACCINATIONS_PANEL}
            onShow={onShow}
            currentPanel={currentPanel}
            onEdit={onEdit}
            editedPanel={editedPanel}
            onCancel={onCancel}
            onSaveSettings={onSaveSettings}
            formValues={vaccinationPanelFormValues}
            isBtnShowPanel
            isEditButton={isButtonVisible(hiddenButtons, 'edit', true)}
          >
            <div className="panel-body-inner">
              <div className="form">
                <div className="form-group-wrapper">
                  <div>

                    { isShowElement(valuesNames.NAME, hideElements) ?
                      <div className="row-expand">
                        <div className="col-expand-left">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.NAME}</label>
                            <div className="form-control-static">{detail[valuesNames.NAME]}</div>
                          </div>
                        </div>
                      </div>
                      : null }

                    { isShowElement(valuesNames.COMMENT, hideElements) ?
                      <div className="row-expand">
                        <div className="col-expand-left">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.COMMENT}</label>
                            <div className="form-control-static">{detail[valuesNames.COMMENT]}</div>
                          </div>
                        </div>
                      </div>
                      : null }

                    { isShowElement(valuesNames.DATE_TIME, hideElements) ?
                      <div className="row-expand">
                        <div className="col-expand-left">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.DATE_TIME}</label>
                            <div className="form-control-static">{vaccinationDateTime}</div>
                          </div>
                        </div>
                      </div>
                      : null }

                    <div className="row-expand">
                      { isShowElement(valuesNames.SERIES_NUMBER, hideElements) ?
                        <div className="col-expand-left">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.SERIES_NUMBER}</label>
                            <div className="form-control-static">{detail[valuesNames.SERIES_NUMBER]}</div>
                          </div>
                        </div>
                        : null }
                    </div>

                    <div className="row-expand">
                      { isShowElement(valuesNames.AUTHOR, hideElements) ?
                        <div className="col-expand-left">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.AUTHOR}</label>
                            <div className="form-control-static">{detail[valuesNames.AUTHOR]}</div>
                          </div>
                        </div>
                        : null }

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </PluginDetailPanel> : null}
          {(expandedPanel === VACCINATIONS_PANEL || expandedPanel === 'all') && editedPanel[VACCINATIONS_PANEL] ? <PluginDetailPanel
            onExpand={onExpand}
            name={VACCINATIONS_PANEL}
            title="Edit Vaccination"
            isOpen={openedPanel === VACCINATIONS_PANEL}
            currentPanel={currentPanel}
            onEdit={onEdit}
            editedPanel={editedPanel}
            onCancel={onCancel}
            onSaveSettings={onSaveSettings}
            formValues={vaccinationPanelFormValues}
            isBtnShowPanel={false}
          >
            <VaccinationDetailForm
              detail={detail}
              isSubmit={isSubmit}
            />
          </PluginDetailPanel> : null }

          {(expandedPanel === SYSTEM_INFO_PANEL || expandedPanel === 'all') && !editedPanel[SYSTEM_INFO_PANEL] && isPanelVisible(hiddenPanels, 'systemInformation') ?
            <PluginDetailPanel
              onExpand={onExpand}
              name={SYSTEM_INFO_PANEL}
              title="System Information"
              isOpen={openedPanel === SYSTEM_INFO_PANEL}
              onShow={onShow}
              currentPanel={currentPanel}
              onEdit={onEdit}
              editedPanel={editedPanel}
              onCancel={onCancel}
              onSaveSettings={onSaveSettings}
              formValues={vaccinationPanelFormValues}
              isBtnShowPanel
              isShowControlPanel={false}
            >
              <div className="panel-body-inner">
                <div className="form">
                  <div className="form-group-wrapper">
                    <div className="row-expand">
                      { isShowElement(valuesNames.DATE, hideElements) ?
                        <div className="col-expand-right">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.DATE}</label>
                            <div className="form-control-static">{dateCreated}</div>
                          </div>
                        </div>
                        : null }
                      { isShowElement(valuesNames.SOURCE, hideElements) ?
                        <div className="col-expand-right">
                          <div className="form-group">
                            <label className="control-label">{valuesLabels.SOURCE}</label>
                            <div className="form-control-static">{detail[valuesNames.SOURCE]}</div>
                          </div>
                        </div>
                        : null }
                    </div>
                  </div>
                </div>
              </div>
            </PluginDetailPanel> : null}

        </div>
      </div>
    )
  }
}
