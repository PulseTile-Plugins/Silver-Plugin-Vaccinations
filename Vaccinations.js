import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import _ from 'lodash/fp';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';

import PluginListHeader from '../../../plugin-page-component/PluginListHeader';
import PluginMainPanel from '../../../plugin-page-component/PluginMainPanel';
import PluginBanner from '../../../plugin-page-component/PluginBanner';
import { columnsConfig, defaultColumnsSelected } from './table-columns.config'
import { valuesNames } from './forms.config';
import { fetchPatientVaccinationsRequest } from './ducks/fetch-patient-vaccinations.duck';
import { fetchPatientVaccinationsDetailRequest } from './ducks/fetch-patient-vaccinations-detail.duck';
import { fetchPatientVaccinationsDetailEditRequest } from './ducks/fetch-patient-vaccinations-detail-edit.duck';
import { fetchPatientVaccinationsCreateRequest } from './ducks/fetch-patient-vaccinations-create.duck';
import { fetchPatientVaccinationsOnMount, fetchPatientVaccinationsDetailOnMount } from '../../config/synopsisRequests';
import { patientVaccinationsSelector, patientVaccinationsDetailSelector, vaccinationPanelFormSelector, vaccinationsCreateFormStateSelector } from './selectors';
import { themeClientUrls } from '../../config/clientUrls';
import { getDDMMMYYYY } from '../../../../utils/time-helpers.utils';
import { checkIsValidateForm, operationsOnCollection } from '../../../../utils/plugin-helpers.utils';
import VaccinationDetail from './VaccinationDetail/VaccinationDetail';
import PluginCreate from '../../../plugin-page-component/PluginCreate';
import VaccinationCreateForm from './VaccinationCreate/VaccinationCreateForm';
import { imageSource } from './ImageSource';
import { themeConfigs } from '../../../../themes.config';
import { isButtonVisible } from '../../../../utils/themeSettings-helper';

const VACCINATIONS_MAIN = 'vaccinationsMain';
const VACCINATIONS_DETAIL = 'vaccinationsDetail';
const VACCINATIONS_CREATE = 'vaccinationsCreate';
const VACCINATIONS_PANEL = 'vaccinationsPanel';
const SYSTEM_INFO_PANEL = 'systemInformationPanel';

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ fetchPatientVaccinationsRequest, fetchPatientVaccinationsDetailRequest, fetchPatientVaccinationsDetailEditRequest, fetchPatientVaccinationsCreateRequest }, dispatch) });

@connect(patientVaccinationsSelector, mapDispatchToProps)
@connect(patientVaccinationsDetailSelector, mapDispatchToProps)
@connect(vaccinationPanelFormSelector)
@connect(vaccinationsCreateFormStateSelector)

@compose(lifecycle(fetchPatientVaccinationsOnMount), lifecycle(fetchPatientVaccinationsDetailOnMount))

export default class Vaccination extends PureComponent {
  static propTypes = {
    allVaccinations: PropTypes.arrayOf(PropTypes.object),
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object,
    }),
  };

  state = {
    nameShouldInclude: '',
    selectedColumns: defaultColumnsSelected,
    openedPanel: VACCINATIONS_PANEL,
    columnNameSortBy: valuesNames.NAME,
    sortingOrder: 'asc',
    expandedPanel: 'all',
    isBtnCreateVisible: false,
    isBtnExpandVisible: false,
    isAllPanelsVisible: false,
    isDetailPanelVisible: false,
    isSecondPanel: false,
    isCreatePanelVisible: false,
    editedPanel: {},
    offset: 0,
    isSubmit: false,
    isLoading: true,
    listPerPageAmount: 10,
  };

  componentDidMount() {
    document.title = themeConfigs.metaTitle + " - " + themeConfigs.patientsSummaryTitles['vaccinations'];
  }

  componentWillReceiveProps({allVaccinations}) {
    const {listPerPageAmount} = this.state;
    const sourceId = this.context.router.route.match.params.sourceId;
    const indexOfCurrentItem = sourceId && allVaccinations ? this.formToShowCollection(allVaccinations).findIndex( _.matches({sourceId: sourceId})) : null;
    const offset = Math.floor(indexOfCurrentItem / listPerPageAmount)*listPerPageAmount;
    const userId = this.context.router.route.match.params.userId;
    const hiddenButtons = get(themeConfigs, 'buttonsToHide.vaccinations', []);
    if (this.context.router.history.location.pathname === `${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}/${sourceId}` && sourceId !== undefined) {
      this.setState({
        isSecondPanel: true,
        isDetailPanelVisible: true,
        isBtnExpandVisible: true,
        isBtnCreateVisible: isButtonVisible(hiddenButtons, 'create', true),
        isCreatePanelVisible: false,
        offset,
      });
    }
    if (this.context.router.history.location.pathname === `${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}/create`) {
      this.setState({
        isSecondPanel: true,
        isBtnExpandVisible: true,
        isBtnCreateVisible: isButtonVisible(hiddenButtons, 'create', false),
        isCreatePanelVisible: true,
        openedPanel: VACCINATIONS_CREATE,
        isDetailPanelVisible: false
      });
    }
    if (this.context.router.history.location.pathname === `${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}`) {
      this.setState({
        isSecondPanel: false,
        isBtnExpandVisible: false,
        isBtnCreateVisible: isButtonVisible(hiddenButtons, 'create', true),
        isCreatePanelVisible: false,
        openedPanel: VACCINATIONS_PANEL,
        isDetailPanelVisible: false,
        expandedPanel: 'all'
      });
    }

    /* istanbul ignore next */
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 500)
  }

  handleExpand = (name, currentPanel) => {
    if (currentPanel === VACCINATIONS_MAIN) {
      if (this.state.expandedPanel === 'all') {
        this.setState({ expandedPanel: name });
      } else {
        this.setState({ expandedPanel: 'all' });
      }
    } else if (this.state.expandedPanel === 'all') {
      this.setState({ expandedPanel: name, openedPanel: name });
    } else {
      this.setState({ expandedPanel: 'all' });
    }
  };

  handleFilterChange = ({ target: { value } }) => this.setState({ nameShouldInclude: _.toLower(value) });

  handleHeaderCellClick = (e, { name, sortingOrder }) => this.setState({ columnNameSortBy: name, sortingOrder });

  handleDetailVaccinationsClick = (sourceId) => {
    const { actions, userId } = this.props;
    const hiddenButtons = get(themeConfigs, 'buttonsToHide.vaccinations', []);
    this.setState({
      isSecondPanel: true,
      isDetailPanelVisible: true,
      isBtnExpandVisible: true,
      isBtnCreateVisible: isButtonVisible(hiddenButtons, 'create', true),
      isCreatePanelVisible: false,
      openedPanel: VACCINATIONS_PANEL,
      editedPanel: {},
      expandedPanel: 'all',
      isLoading: true
    });
    actions.fetchPatientVaccinationsDetailRequest({ userId, sourceId });
    this.context.router.history.push(`${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}/${sourceId}`);
  };

  handleSetOffset = offset => this.setState({ offset });

  handleCreate = () => {
    const { userId } = this.props;
    this.setState({ isBtnCreateVisible: false, isCreatePanelVisible: true, openedPanel: VACCINATIONS_CREATE, isSecondPanel: true, isDetailPanelVisible: false, isBtnExpandVisible: true, expandedPanel: 'all', isSubmit: false, isLoading: true });
    this.context.router.history.push(`${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}/create`);
  };

  handleShow = (name) => {
    this.setState({ openedPanel: name });
    if (this.state.expandedPanel !== 'all') {
      this.setState({ expandedPanel: name });
    }
  };

  handleEdit = (name) => {
    this.setState(prevState => ({
      editedPanel: {
        ...prevState.editedPanel,
        [name]: true,
      },
      isSubmit: false,
    }))
  };

  handleVaccinationDetailCancel = (name) => {
    this.setState(prevState => ({
      editedPanel: {
        ...prevState.editedPanel,
        [name]: false,
      },
      isSubmit: false,
      isLoading: true,
    }))
  };

  handleSaveSettingsDetailForm = (formValues, name) => {
    const { actions, vaccinationPanelFormState } = this.props;
    if (checkIsValidateForm(vaccinationPanelFormState)) {
      actions.fetchPatientVaccinationsDetailEditRequest(this.formValuesToString(formValues, 'edit'));
      this.setState(prevState => ({
        editedPanel: {
          ...prevState.editedPanel,
          [name]: false,
        },
        isSubmit: false,
        isLoading: true,
      }))
    } else {
      this.setState({ isSubmit: true });
    }
  };

  handleCreateCancel = () => {
    const { userId } = this.props;
    this.setState({ isBtnCreateVisible: true, isCreatePanelVisible: false, openedPanel: VACCINATIONS_PANEL, isSecondPanel: false, isBtnExpandVisible: false, expandedPanel: 'all', isSubmit: false, isLoading: true });
    this.context.router.history.push(`${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}`);
  };

  handleSaveSettingsCreateForm = (formValues) => {
    const { actions, userId, vaccinationCreateFormState } = this.props;

    if (checkIsValidateForm(vaccinationCreateFormState)) {
      actions.fetchPatientVaccinationsCreateRequest(this.formValuesToString(formValues, 'create'));
      this.context.router.history.push(`${themeClientUrls.PATIENTS}/${userId}/${themeClientUrls.VACCINATIONS}`);
      this.setState({ isSubmit: false, isLoading: true });
      this.hideCreateForm();
    } else {
      this.setState({ isSubmit: true });
    }
  };

  formValuesToString = (formValues, formName) => {
    const { userId, vaccinationDetail } = this.props;
    const sendData = {};

    sendData.userId = userId;
    sendData[valuesNames.NAME] = formValues[valuesNames.NAME];
    sendData[valuesNames.SERIES_NUMBER] = formValues[valuesNames.SERIES_NUMBER];
    sendData[valuesNames.COMMENT] = formValues[valuesNames.COMMENT];
    sendData[valuesNames.SOURCE] = formValues[valuesNames.SOURCE];
    sendData[valuesNames.DATE] = new Date();

    if (formName === 'edit') {
      sendData[valuesNames.SOURCE_ID] = vaccinationDetail[valuesNames.SOURCE_ID];
      sendData[valuesNames.DATE_TIME] = formValues[valuesNames.DATE_TIME];
    }

    if (formName === 'create') {
      sendData[valuesNames.DATE_TIME] = new Date(formValues[valuesNames.DATE_TIME]);
    }

    operationsOnCollection.propsToString(sendData, valuesNames.DATE, valuesNames.DATE_TIME);
    return sendData;
  };

  hideCreateForm = () => {
    this.setState({ isBtnCreateVisible: true, isCreatePanelVisible: false, openedPanel: VACCINATIONS_PANEL, isSecondPanel: false, expandedPanel: 'all', isBtnExpandVisible: false })
  };

  formToShowCollection = (collection) => {
    const { columnNameSortBy, sortingOrder, nameShouldInclude } = this.state;

    collection = operationsOnCollection.modificate(collection, [{
      keyFrom: valuesNames.DATE,
      keyTo: `${valuesNames.DATE}Convert`,
      fn: getDDMMMYYYY,
    }]);

    return operationsOnCollection.filterAndSort({
      collection,
      filterBy: nameShouldInclude,
      sortingByKey: columnNameSortBy,
      sortingByOrder: sortingOrder,
      filterKeys: [valuesNames.NAME, valuesNames.SOURCE, `${valuesNames.DATE}Convert`],
    });
  };

  render() {
    const { selectedColumns, columnNameSortBy, sortingOrder, isSecondPanel, isDetailPanelVisible, isBtnExpandVisible, expandedPanel, openedPanel, isBtnCreateVisible, isCreatePanelVisible, editedPanel, offset, isSubmit, isLoading, listPerPageAmount } = this.state;
    const { allVaccinations, vaccinationDetail, vaccinationPanelFormState, vaccinationCreateFormState } = this.props;

    const isPanelDetails = (expandedPanel === VACCINATIONS_DETAIL || expandedPanel === VACCINATIONS_PANEL || expandedPanel === SYSTEM_INFO_PANEL);
    const isPanelMain = (expandedPanel === VACCINATIONS_MAIN);
    const isPanelCreate = (expandedPanel === VACCINATIONS_CREATE);

    const columnsToShowConfig = columnsConfig.filter(columnConfig => selectedColumns[columnConfig.key]);

    const filteredVaccinations = this.formToShowCollection(allVaccinations);

    const hiddenButtons = get(themeConfigs, 'buttonsToHide.vaccinations', []);

    let sourceId;
    if (isDetailPanelVisible && !_.isEmpty(vaccinationDetail)) {
      sourceId = vaccinationDetail[valuesNames.SOURCE_ID];
    }

    return (<section className="page-wrapper">
      {!(isDetailPanelVisible || isCreatePanelVisible) ?
        <PluginBanner
          title='Vaccinations'
          subTitle='A record of the immunisations/vaccines you have had to help you avoid ill health'
          img={imageSource}
        />
        : null
      }
      <div className={classNames('section', { 'full-panel full-panel-main': isPanelMain, 'full-panel full-panel-details': (isPanelDetails || isPanelCreate) })}>
        <Row>
          {(isPanelMain || expandedPanel === 'all') ? <Col xs={12} className={classNames({ 'col-panel-main': isSecondPanel })}>
            <div className="panel panel-primary">
              <PluginListHeader
                onFilterChange={this.handleFilterChange}
                panelTitle="Vaccinations"
                isBtnExpandVisible={isBtnExpandVisible}
                isBtnTableVisible={false}
                name={VACCINATIONS_MAIN}
                onExpand={this.handleExpand}
                currentPanel={VACCINATIONS_MAIN}
              />
              <PluginMainPanel
                headers={columnsToShowConfig}
                resourceData={allVaccinations}
                emptyDataMessage="No information available"
                onHeaderCellClick={this.handleHeaderCellClick}
                onCellClick={this.handleDetailVaccinationsClick}
                columnNameSortBy={columnNameSortBy}
                sortingOrder={sortingOrder}
                table="vaccinations"
                filteredData={filteredVaccinations}
                totalEntriesAmount={_.size(filteredVaccinations)}
                offset={offset}
                setOffset={this.handleSetOffset}
                isBtnCreateVisible={isBtnCreateVisible}
                onCreate={this.handleCreate}
                id={sourceId}
                isLoading={isLoading}
                listPerPageAmount={listPerPageAmount}
              />
            </div>
          </Col> : null }
          {(expandedPanel === 'all' || isPanelDetails) && isDetailPanelVisible && !isCreatePanelVisible ? <Col xs={12} className={classNames({ 'col-panel-details': isSecondPanel })}>
            <VaccinationDetail
              onExpand={this.handleExpand}
              name={VACCINATIONS_DETAIL}
              openedPanel={openedPanel}
              expandedPanel={expandedPanel}
              currentPanel={VACCINATIONS_DETAIL}
              detail={vaccinationDetail}
              onEdit={this.handleEdit}
              onShow={this.handleShow}
              editedPanel={editedPanel}
              onCancel={this.handleVaccinationDetailCancel}
              onSaveSettings={this.handleSaveSettingsDetailForm}
              vaccinationPanelFormValues={vaccinationPanelFormState.values}
              isSubmit={isSubmit}
            />
          </Col> : null}
          {(expandedPanel === 'all' || isPanelCreate) && isCreatePanelVisible && !isDetailPanelVisible ? <Col xs={12} className={classNames({ 'col-panel-details': isSecondPanel })}>
            <PluginCreate
              onExpand={this.handleExpand}
              headingName="vaccinations"
              name={VACCINATIONS_CREATE}
              openedPanel={openedPanel}
              onShow={this.handleShow}
              expandedPanel={expandedPanel}
              currentPanel={VACCINATIONS_CREATE}
              onSaveSettings={this.handleSaveSettingsCreateForm}
              formValues={vaccinationCreateFormState.values}
              onCancel={this.handleCreateCancel}
              isCreatePanelVisible={isCreatePanelVisible}
              isCreationPermitted={isButtonVisible(hiddenButtons, 'create', true)}
              componentForm={
                <VaccinationCreateForm isSubmit={isSubmit} />
              }
              title="Create Vaccination"
            />
          </Col> : null}
        </Row>
      </div>
    </section>)
  }
}
