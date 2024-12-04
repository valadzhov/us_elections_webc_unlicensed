import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineComponents, IgcCardComponent, IgcIconComponent } from 'igniteui-webcomponents';
import { IgcCategoryChartModule, IgcPieChartModule } from 'igniteui-webcomponents-charts';
import { ModuleManager } from 'igniteui-webcomponents-core';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Subject, takeUntil } from 'rxjs';
import 'igniteui-webcomponents-grids/grids/combined.js';
import { VoteResult } from '../models/USElectionsData/vote-result';
import { VoteCountResult } from '../models/USElectionsData/vote-count-result';
import { CandidateVoteResult } from '../models/USElectionsData/candidate-vote-result';
import { StateVoteResult } from '../models/USElectionsData/state-vote-result';
import { Candidate } from '../models/USElectionsData/candidate';
import { stateService } from '../services/State-service';
import { uSElectionsDataService } from '../services/USElectionsData-service';

defineComponents(IgcIconComponent, IgcCardComponent);

ModuleManager.register(IgcPieChartModule, IgcCategoryChartModule);

@customElement('app-candidates-and-votes')
export default class CandidatesAndVotes extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .column-layout {
      display: flex;
      flex-direction: column;
    }
    .group {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 32px;
      overflow: auto;
      position: relative;
      padding: 24px;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .row-layout {
      display: flex;
    }
    .header {
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: stretch;
      align-content: stretch;
      gap: 24px;
      position: relative;
      flex-shrink: 0;
    }
    .year_container {
      justify-content: center;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 500px;
      min-height: 160px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .year {
      justify-content: center;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-height: 160px;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .group_1 {
      background-color: var(--ig-primary-500);
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 18px;
      position: relative;
      padding: 0 16px;
      height: 32px;
      min-width: 50px;
      min-height: 32px;
      max-height: 32px;
    }
    .group_2 {
      background-image: url("/src/assets/flag-gradient.png");
      background-size: cover;
      background-repeat: no-repeat;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_3 {
      justify-content: center;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      padding: 8px 0;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .group_4 {
      background-color: transparent;
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 18px;
      position: relative;
      padding: 0 16px;
      height: 32px;
      min-width: 50px;
      min-height: 32px;
      max-height: 32px;
    }
    .group_5 {
      background-color: var(--ig-secondary-700);
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 18px;
      position: relative;
      padding: 0 16px;
      height: 32px;
      min-width: 50px;
      min-height: 32px;
      max-height: 32px;
    }
    .candidates {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      min-width: 510px;
      flex-grow: 2;
      flex-basis: 0;
    }
    .card {
      --ig-size: var(--ig-size-medium);
      height: max-content;
      min-width: 480px;
      flex-grow: 1;
      flex-basis: 0;
      flex-direction: row;
    }
    .group_6 {
      flex-grow: 1;
    }
    .group_7 {
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      gap: 16px;
      top: -16px;
      position: relative;
      padding: 0 0 0 16px;
    }
    .group_8 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      gap: 8px;
      position: relative;
    }
    .dm_pill_small {
      background-color: var(--ig-primary-500);
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 18px;
      position: relative;
      padding: 1px 8px 0;
      height: 24px;
      min-width: 50px;
      min-height: 24px;
      max-height: 30px;
    }
    .group_9 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 320px;
    }
    .group_10 {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      position: relative;
      min-width: 100px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_11 {
      border-color: var(--ig-gray-500);
      border-width: 0px 0px 0px 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      position: relative;
      padding: 0 0 0 16px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .rp_pill_small {
      background-color: var(--ig-secondary-500);
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 18px;
      position: relative;
      padding: 1px 8px 0;
      height: 24px;
      min-width: 50px;
      min-height: 24px;
      max-height: 30px;
    }
    .pies_and_grid {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      flex-shrink: 0;
    }
    .pie_charts {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      min-width: 520px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_12 {
      background-color: transparent;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 240px;
      min-height: 320px;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .group_13 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_14 {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 8px;
      position: relative;
    }
    .sources_pill_small {
      background-color: var(--ig-warn-500);
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      gap: 18px;
      position: relative;
      padding: 1px 8px 0;
      height: 24px;
      min-width: max-content;
      min-height: 24px;
      max-height: 24px;
    }
    .group_15 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: baseline;
      align-content: flex-start;
      gap: 3px;
      position: relative;
    }
    .icon {
      --size: 18px;
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--ig-surface-500);
    }
    .content {
      text-align: center;
      color: var(--ig-primary-500);
      height: max-content;
      min-width: min-content;
    }
    .text {
      text-align: center;
      color: var(--ig-secondary-600);
      height: max-content;
      min-width: min-content;
    }
    .text_1 {
      color: var(--ig-surface-500);
      height: max-content;
      min-width: min-content;
    }
    .h5 {
      color: var(--ig-gray-800);
      height: max-content;
      min-width: min-content;
    }
    .text_2 {
      text-align: center;
      height: max-content;
      min-width: min-content;
    }
    .image {
      height: 100%;
      min-height: 100%;
      max-height: 100%;
    }
    .h4 {
      text-align: center;
      color: var(--ig-secondary-500);
      height: max-content;
      min-width: min-content;
    }
    .text_3 {
      color: var(--ig-primary-500);
      height: max-content;
      min-width: min-content;
    }
    .text_4 {
      height: max-content;
      min-width: min-content;
    }
    .hyperlink {
      color: var(--ig-info-500);
      cursor: pointer;
      height: max-content;
      min-width: min-content;
      flex-shrink: 0;
    }
    .body-content {
      min-width: 50px;
      min-height: 50px;
    }
    .media-content {
      width: 160px;
      min-width: 160px;
      max-width: 160px;
    }
    .pie-chart {
      --brushes: #273267 #DC2B38 #A8A8A8;
      --outlines: #273267 #DC2B38 #A8A8A8;
      min-width: 200px;
      min-height: 200px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .category-chart {
      --brushes: #273267 #DC2B38;
      --outlines: #273267 #DC2B38;
      --marker-brushes: #273267 #DC2B38;
      --marker-outlines: #273267 #DC2B38;
      min-width: 400px;
      min-height: 280px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .grid {
      --ig-size: var(--ig-size-medium);
      min-width: 500px;
      min-height: 224px;
      flex-grow: 1;
      flex-basis: 0;
    }
  `;

  constructor() {
    super();
    stateService.currentlyChosenYear.subscribe(x => this.requestUpdate());
    uSElectionsDataService.democratCandidate.subscribe(x => { this.democratCandidate = x; this.requestUpdate(); });
    uSElectionsDataService.electoralVotesDemocrat.subscribe(x => { this.electoralVotesDemocrat = x; this.requestUpdate(); });
    uSElectionsDataService.popularVotesDemocrat.subscribe(x => { this.popularVotesDemocrat = x; this.requestUpdate(); });
    uSElectionsDataService.republicanCandidate.subscribe(x => { this.republicanCandidate = x; this.requestUpdate(); });
    uSElectionsDataService.electoralVotesRepublican.subscribe(x => { this.electoralVotesRepublican = x; this.requestUpdate(); });
    uSElectionsDataService.popularVotesRepublican.subscribe(x => { this.popularVotesRepublican = x; this.requestUpdate(); });
    stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => { uSElectionsDataService.getVoteResultList(stateService.currentlyChosenYear.value as any).then((data) => {
        this.uSElectionsDataVoteResult = data;
      });
    });
    stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => { uSElectionsDataService.getVoteResultList1(stateService.currentlyChosenYear.value as any).then((data) => {
        this.uSElectionsDataVoteResult1 = data;
      });
    });
    stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => { uSElectionsDataService.getCandidateVoteResultList(stateService.currentlyChosenYear.value as any).then((data) => {
        this.uSElectionsDataCandidateVoteResult = data;
      });
    });
    stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => { uSElectionsDataService.getStateVoteResultList(stateService.currentlyChosenYear.value as any).then((data) => {
        this.uSElectionsDataStateVoteResult = data;
      });
    });
  }

  private democratCandidate?: Candidate;
  private electoralVotesDemocrat?: VoteCountResult;
  private popularVotesDemocrat?: VoteCountResult;
  private republicanCandidate?: Candidate;
  private electoralVotesRepublican?: VoteCountResult;
  private popularVotesRepublican?: VoteCountResult;

  @state()
  private uSElectionsDataVoteResult: VoteResult[] = [];

  @state()
  private uSElectionsDataVoteResult1: VoteResult[] = [];

  @state()
  private uSElectionsDataCandidateVoteResult: CandidateVoteResult[] = [];

  @state()
  private uSElectionsDataStateVoteResult: StateVoteResult[] = [];

  @state()
  private destroy$: Subject<void> = new Subject<void>();

  disconnectedCallback() {
    this.destroy$.next();
    this.destroy$.complete();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <link rel='stylesheet' href='../../ig-theme.css'>
      <link rel='stylesheet' href='node_modules/igniteui-webcomponents-grids/grids/themes/light/material.css'>
      <div class="column-layout group">
        <div class="row-layout header">
          <div class="row-layout year_container">
            <div class="column-layout year">
              <div class="row-layout group_1">
                <span class="material-icons icon">
                  star
                </span>
                <span class="material-icons icon">
                  star
                </span>
                <span class="material-icons icon">
                  star
                </span>
                <span class="material-icons icon">
                  star
                </span>
                <span class="material-icons icon">
                  star
                </span>
              </div>
              <div class="row-layout group_2">
                <div class="column-layout group_3">
                  <h2 class="content">
                    ${stateService.currentlyChosenYear.value}
                  </h2>
                </div>
              </div>
              <div class="row-layout group_4">
                <p class="typography__subtitle-2 text">
                  P R E S I D E N T I A L
                </p>
              </div>
              <div class="row-layout group_5">
                <p class="typography__subtitle-2 text_1">
                  E L E C T I O N
                </p>
              </div>
            </div>
          </div>
          <div class="row-layout candidates">
            <igc-card class="card">
              <div class="group_6">
                <igc-card-header>
                  <h3 slot="title">
                </h3>
                  <h5 slot="subtitle">
                </h5>
                </igc-card-header>
                <igc-card-content class="body-content">
                  <div class="column-layout group_7">
                    <div class="column-layout group_8">
                      <h5 class="h5">
                        ${this.democratCandidate?.name}
                      </h5>
                      <div class="row-layout dm_pill_small">
                        <p class="typography__overline text_1">
                          DEMOCRATIC
                        </p>
                      </div>
                    </div>
                    <div class="row-layout group_9">
                      <div class="column-layout group_10">
                        <h4 class="content">
                          ${this.electoralVotesDemocrat?.votes}
                        </h4>
                        <p class="typography__subtitle-2 text_2">
                          Electoral Votes
                        </p>
                      </div>
                      <div class="column-layout group_11">
                        <h4 class="content">
                          ${this.popularVotesDemocrat?.votes}
                        </h4>
                        <p class="typography__subtitle-2 text_2">
                          Popular Votes
                        </p>
                      </div>
                    </div>
                  </div>
                </igc-card-content>
              </div>
              <igc-card-media class="media-content">
                <img src="${ifDefined(this.democratCandidate?.imageFull)}" class="image" />
              </igc-card-media>
            </igc-card>
            <igc-card class="card">
              <div class="group_6">
                <igc-card-header>
                  <h3 slot="title">
                </h3>
                  <h5 slot="subtitle">
                </h5>
                </igc-card-header>
                <igc-card-content class="body-content">
                  <div class="column-layout group_7">
                    <div class="column-layout group_8">
                      <h5 class="h5">
                        ${this.republicanCandidate?.name}
                      </h5>
                      <div class="row-layout rp_pill_small">
                        <p class="typography__overline text_1">
                          REPUBLICAN
                        </p>
                      </div>
                    </div>
                    <div class="row-layout group_9">
                      <div class="column-layout group_10">
                        <h4 class="h4">
                          ${this.electoralVotesRepublican?.votes}
                        </h4>
                        <p class="typography__subtitle-2 text_2">
                          Electoral Votes
                        </p>
                      </div>
                      <div class="column-layout group_11">
                        <h4 class="h4">
                          ${this.popularVotesRepublican?.votes}
                        </h4>
                        <p class="typography__subtitle-2 text_2">
                          Popular Votes
                        </p>
                      </div>
                    </div>
                  </div>
                </igc-card-content>
              </div>
              <igc-card-media class="media-content">
                <img src="${ifDefined(this.republicanCandidate?.imageFull)}" class="image" />
              </igc-card-media>
            </igc-card>
          </div>
        </div>
        <div class="row-layout pies_and_grid">
          <div class="row-layout pie_charts">
            <div class="column-layout group_12">
              <p class="typography__subtitle-2 content">
                Electoral Vote
              </p>
              <igc-pie-chart .dataSource="${this.uSElectionsDataVoteResult}" start-angle="90" label-inner-color="#FAFAFA" others-category-threshold="0.5" label-member-path="resultAsString" value-member-path="resultAsNumber" class="pie-chart"></igc-pie-chart>
            </div>
            <div class="column-layout group_12">
              <p class="typography__subtitle-2 content">
                Popular Vote
              </p>
              <igc-pie-chart .dataSource="${this.uSElectionsDataVoteResult1}" start-angle="90" label-inner-color="#FAFAFA" others-category-threshold="0.5" label-member-path="resultAsString" value-member-path="resultAsNumber" class="pie-chart"></igc-pie-chart>
            </div>
          </div>
          <div class="column-layout group_13">
            <igc-grid .data="${this.uSElectionsDataCandidateVoteResult}" primary-key="party" ?allow-filtering="${true}" filter-mode="excelStyleFilter" class="ig-typography ig-scrollbar grid">
              <igc-column field="party" data-type="string" header="Party" ?sortable="${true}" selectable="false"></igc-column>
              <igc-column field="candidateName" data-type="string" header="Candidate" ?sortable="${true}" selectable="false"></igc-column>
              <igc-column field="electoralVotesNumber" data-type="number" header="Electoral Votes" ?sortable="${true}" selectable="false"></igc-column>
              <igc-column field="electoralVotesPercentage" data-type="number" header="Electoral Votes (%)" ?sortable="${true}" selectable="false"></igc-column>
              <igc-column field="popularVotesNumber" data-type="number" header="Popular Votes" ?sortable="${true}" selectable="false"></igc-column>
              <igc-column field="popularVotesPercentage" data-type="number" header="Popular Votes (%)" ?sortable="${true}" selectable="false"></igc-column>
            </igc-grid>
          </div>
        </div>
        <div class="column-layout group_13">
          <p class="typography__subtitle-2 text_3">
            Votes by State
          </p>
          <igc-category-chart .dataSource="${this.uSElectionsDataStateVoteResult}" chart-type="column" x-axis-label-angle="60" computed-plot-area-margin-mode="series" class="category-chart"></igc-category-chart>
          <div class="row-layout group_14">
            <div class="row-layout sources_pill_small">
              <p class="typography__overline text_4">
                SOURCES
              </p>
            </div>
            <div class="row-layout group_15">
              <a href="https://apnews.com/" class="typography__caption hyperlink">
                AP News,
              </a>
              <a href="https://www.politico.com/" class="typography__caption hyperlink">
                Politico,
              </a>
              <a href="https://edition.cnn.com/" class="typography__caption hyperlink">
                CNN Politics
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
