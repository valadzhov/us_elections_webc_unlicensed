import { html, css, LitElement } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing.js';
import { defineComponents, IgcIconButtonComponent, IgcIconComponent, IgcNavbarComponent, IgcNavDrawerComponent, IgcRippleComponent } from 'igniteui-webcomponents';
import { YearModel } from './models/USElectionsData/year-model';
import { stateService } from './services/State-service';
import { uSElectionsDataService } from './services/USElectionsData-service';

defineComponents(IgcNavbarComponent, IgcIconButtonComponent, IgcIconComponent, IgcRippleComponent, IgcNavDrawerComponent);

@customElement('app-root')
export default class App extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .navbar {
      background-color: var(--ig-primary-500);
      height: max-content;
      min-width: min-content;
    }
    .nav-drawer {
      min-width: min-content;
      min-height: 0;
      max-width: 105px;
      flex-shrink: 0;
    }
    .view-container {
      overflow: auto;
      display: block;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;
    }
    .nav-drawer::part(main) {
      width: 105px;
    }
    .icon-button {
      --ig-size: var(--ig-size-large);
    }
    .icon-button::part(base) {
      color: white;
    }
    .icon {
      color: white;
    }
    .h6 {
      margin: 0;
      flex-shrink: 0;
    }
    .icon_1 {
      --size: 18px;
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--ig-surface-500);
    }
    .text {
      color: var(--ig-surface-500);
      height: max-content;
      min-width: min-content;
    }
    .hyperlink {
      color: var(--ig-surface-500);
      cursor: pointer;
      height: max-content;
      min-width: min-content;
      flex-shrink: 0;
    }
    .row-layout {
      display: flex;
    }
    .group {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 1rem;
      overflow: hidden;
    }
    .group_1 {
      background-color: var(--ig-secondary-500);
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      height: 8px;
      min-width: 50px;
      min-height: 8px;
      max-height: 8px;
    }
    .group_2 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_3 {
      background-color: var(--ig-primary-500);
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      height: 48px;
      min-width: 50px;
      min-height: 48px;
      max-height: 48px;
    }
    .group_4 {
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      position: relative;
      width: 183px;
      min-width: 50px;
      min-height: 30px;
      max-width: 183px;
    }
  `;

  constructor() {
    super();
    uSElectionsDataService.getYearModelList().then(data => this.uSElectionsDataYearModel = data);
  }

  @query('#nav-drawer')
  private navDrawer?: IgcNavDrawerComponent;

  @state()
  private uSElectionsDataYearModel: YearModel[] = [];

  public navDrawerItemClick(item: YearModel) {
    stateService.currentlyChosenYear.next(item.year);
  }

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <link rel='stylesheet' href='../../ig-theme.css'>
      <igc-navbar class="navbar">
        <igc-icon-button slot="start" variant="flat" @click="${() => this.navDrawer?.toggle()}" class="icon-button">
          <span class="material-icons icon">
            menu
          </span>
          <igc-ripple></igc-ripple>
        </igc-icon-button>
        <div class="row-layout group">
          <h6 class="h6">
            US Presidential Elections over the years
          </h6>
        </div>
      </igc-navbar>
      <div class="row-layout group_1"></div>
      <div class="row-layout group_2">
        <igc-nav-drawer ?open="${true}" position="relative" id="nav-drawer" class="nav-drawer">
          <igc-nav-drawer-header-item>
            <div slot="content">YEAR</div>
          </igc-nav-drawer-header-item>
          ${this.uSElectionsDataYearModel?.map((item) => html`
            <igc-nav-drawer-item @click="${() => this.navDrawerItemClick(item)}">
              <div slot="content">${item.year}</div>
            </igc-nav-drawer-item>
          `)}
        </igc-nav-drawer>
        <router-outlet class="view-container"></router-outlet>
      </div>
      <div class="row-layout group_1"></div>
      <div class="row-layout group_3">
        <span class="material-icons icon_1">
          star
        </span>
        <div class="row-layout group_4">
          <p class="typography__body-2 text">
            Powered by
          </p>
          <a href="https://www.appbuilder.dev/" class="typography__body-2 hyperlink">
            App Builder
          </a>
        </div>
        <span class="material-icons icon_1">
          star
        </span>
      </div>
    `;
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('router-outlet');
    const router = new Router(outlet);
    router.setRoutes(routes);
  }
}
