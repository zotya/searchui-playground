import React from "react";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting
} from "@elastic/react-search-ui";
import { Layout, SingleSelectFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";

//import myHitsTable from "."

const config = {
  debug: true,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async ({ searchTerm }) => {
    const requestBody = buildRequest({ searchTerm });
    const json = await runRequest(requestBody);
    const state = buildState(json);
    return {
      autocompletedResults: state.results
    };
  },
  onSearch: async state => {
    const { resultsPerPage } = state;
    const requestBody = buildRequest(state);
    // Note that this could be optimized by running all of these requests
    // at the same time. Kept simple here for clarity.
    const responseJson = await runRequest(requestBody);
    const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
      responseJson,
      state,
      ["Country"]
    );
    return buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage);
  },
  initialState: {
    resultsPerPage: 10
  }
};

const pamFields = {
  "Country":"Country",
  "ID_of_policy_or_measure":"ID of policy or measure",
  "Report_ID_ES":"",
  "Name_of_policy_or_measure":"Name of policy or measure",
  "Single_policy_or_measure__or_group_of_measures":"Single policy or measure, or group of measures",
  "Policies_or_measures_included_in_the_group":"Policies or measures included in the group",
  "Type_of_policy_instrument":"Type of policy instrument",
  "Status_of_implementation":"Status of implementation",
  "Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions":"Policy impacting EU ETS, ESD or LULUCF emissions",
  "Sector_s__affected":"Sector(s) affected",
  "Objective_s_":"Objective(s)",
  "Total_GHG_emissions_reductions_in_2020__kt_CO2eq_y_":"Total GHG emissions reductions in 2020 (kt CO2eq/y)",
  "Total_GHG_emissions_reductions_in_2030__kt_CO2eq_y_":"Total GHG emissions reductions in 2030 (kt CO2eq/y)",
  "Entities_responsible_for_implementing_the_policy":"Entities responsible for implementing the policy",
  "Implementation_period_start":"Implementation period start",
  "Is_the_policy_or_measure_related_to_a_Union_policy_":"Is the policy or measure related to a Union policy?",
  "Related_Union_Policy":"Related Union Policy",
  "GHG_s__affected":"GHG(s) affected",
  "Projection_scenario_in_which_the_policy_or_measure_is_included":"Projection scenario in which the policy or measure is included",
  "Description":"Description",
  "Quantified_objective":"Quantified objective",
  "Implementation_period_finish":"Implementation period finish",
  "Indicator_used_to_monitor_and_evaluate_progress_over_time":"Indicator used to monitor and evaluate progress over time",
  "General_comment":"General comment",
  "Main_reference":"Main reference",
  "URL_to_main_reference":"URL to main reference",
  "GHG_emissions_reductions_EU_ETS_in_2020__kt_CO2eq_y_":"GHG emissions reductions EU ETS in 2020 (kt CO2eq/y)",
  "GHG_emissions_reductions_ESD_in_2020__kt_CO2eq_y_":"GHG emissions reductions ESD in 2020 (kt CO2eq/y)",
  "GHG_emissions_reductions_EU_ETS_in_2025__kt_CO2eq_y_":"GHG emissions reductions EU ETS in 2025 (kt CO2eq/y)",
  "GHG_emissions_reductions_ESD_in_2025__kt_CO2eq_y_":"GHG emissions reductions ESD in 2025 (kt CO2eq/y)",
  "Total_GHG_emissions_reductions_in_2025__kt_CO2eq_y_":"Total GHG emissions reductions in 2025 (kt CO2eq/y)",
  "GHG_emissions_reductions_EU_ETS_in_2030__kt_CO2eq_y_":"GHG emissions reductions EU ETS in 2030 (kt CO2eq/y)",
  "GHG_emissions_reductions_ESD_in_2030__kt_CO2eq_y_":"GHG emissions reductions ESD in 2030 (kt CO2eq/y)",
  "GHG_emissions_reductions_EU_ETS_in_2035__kt_CO2eq_y_":"GHG emissions reductions EU ETS in 2035 (kt CO2eq/y)",
  "GHG_emissions_reductions_ESD_in_2035__kt_CO2eq_y_":"GHG emissions reductions ESD in 2035 (kt CO2eq/y)",
  "Total_GHG_emissions_reductions_in_2035__kt_CO2eq_y_":"Total GHG emissions reductions in 2035 (kt CO2eq/y)",
  "Reference_for_ex_ante_assessment":"Reference for ex-ante assessment",
  "Web_link_for_ex_ante_assessment":"Web link for ex-ante assessment",
  "Year_for_which_reduction_applies__ex_post_":"Year for which reduction applies (ex post)",
  "Average_ex_post_emission_reduction__kt_CO2eq_y_":"Average ex post emission reduction (kt CO2eq/y)",
  "Explanation_of_the_basis_for_the_mitigation_estimates":"Explanation of the basis for the mitigation estimates",
  "Factors_affected_by_the_policy_or_measure":"Factors affected by the policy or measure",
  "Reference_for_ex_post_assessment":"Reference for ex-post assessment",
  "Web_link_for_ex_post_assessment":"Web link for ex-post assessment",
  "Projected_costs__EUR_per_tonne_CO2eq_reduced__sequestered_":"Projected costs (EUR per tonne CO2eq reduced/ sequestered)",
  "Projected_absolute_costs_per_year__EUR_":"Projected absolute costs per year (EUR)",
  "Year_projected_cost_has_been_calculated_for":"Year projected cost has been calculated for",
  "Price_reference_year__projected_costs_":"Price reference year (projected costs)",
  "Projected_benefits__EUR_per_tonne_CO2eq_reduced__sequestered_":"Projected benefits (EUR per tonne CO2eq reduced/ sequestered)",
  "Projected_absolute_benefit_per_year__EUR_":"Projected absolute benefit per year (EUR)",
  "Projected_net_costs__EUR_per_tonne_CO2eq_reduced__sequestered_":"Projected net costs (EUR per tonne CO2eq reduced/ sequestered)",
  "Projected_net_cost_per_year__EUR_":"Projected net cost per year (EUR)",
  "Description_of_projected_cost_estimates":"Description of projected cost estimates",
  "Reference_for_projected_costs_and_benefits":"Reference for projected costs and benefits",
  "Web_link_for_projected_costs_and_benefits":"Web link for projected costs and benefits",
  "Realised_costs___EUR_per_tonne_CO2eq_reduced__sequestered_":"Realised costs (EUR per tonne CO2eq reduced/ sequestered)",
  "Realised_absolute_costs_per_year__EUR_":"Realised absolute costs per year (EUR)",
  "Year_realised_cost_has_been_calculated_for":"Year realised cost has been calculated for",
  "Price_reference_year__realised_costs_":"Price reference year (realised costs)",
  "Realised_benefits__EUR_per_tonne_CO2eq_reduced__sequestered_":"Realised benefits (EUR per tonne CO2eq reduced/ sequestered)",
  "Realised_absolute_benefit_per_year__EUR_":"Realised absolute benefit per year (EUR)",
  "Realised_net_costs__EUR_per_tonne_CO2eq_reduced__sequestered_":"Realised net costs (EUR per tonne CO2eq reduced/ sequestered)",
  "Realised_net_cost_per_year__EUR_":"Realised net cost per year (EUR)",
  "Description_of_realised_cost_estimates":"Description of realised cost estimates",
  "Reference_for_realised_costs_and_benefits":"Reference for realised costs and benefits",
  "Web_link_for_realised_costs_and_benefits":"Web link for realised costs and benefits"

/*
  "Report_ID":"",
  "Objective_s__lookup_only4facets":"",
  "Entities_responsible_for_implementing_the_policy__type_":"",
  "Union_policies_lookup_only4facets":"",
  "Link_to_national_report":"",
*/
}

export default function App() {
  const cols = Object.keys(pamFields)
  console.log(cols)
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={
                  <SearchBox
                    autocompleteMinimumCharacters={3}
                    autocompleteSuggestions={true}
                  />
                }
                sideContent={
                  <div>
                    {wasSearched && (
                      <Sorting
                        label={"Sort by"}
                        sortOptions={[
                          {
                            name: "ID of policy or measure",
                            value: "ID_of_policy_or_measure",
                            direction: "asc"
                          },
                          {
                            name: "ID of policy or measure - desc",
                            value: "ID_of_policy_or_measure",
                            direction: "desc"
                          },
                          {
                            name: "Country",
                            value: "Country",
                            direction: "asc"
                          },
                          {
                            name: "Country - desc",
                            value: "Country",
                            direction: "desc"
                          }
                        ]}
                      />
                    )}
                    <Facet
                      field="Country"
                      label="Country"
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field="GHG_s__affected"
                      label="GHG(s) affected"
                      filterType="any"
                    />
                  </div>
                }
                bodyContent={
                  <WithSearch mapContextToProps={({ results }) => ({ results })}>
                    {({ results }) => {
                      return (
                        <div>
                            <table>
                              <thead>
                                <tr>
                                {cols.map((col)=>(
                                  <>
                                  {(col !== 'Report_ID_ES')?
                                    (
                                    <th key={col}>
                                      <div style={{width:200+'px'}}>
                                      {pamFields[col]}
                                      </div>
                                    </th>
                                    )
                                    :
                                    (
                                      <></>
                                    )
                                  }
                                  </>
                                ))}
                                </tr>
                              </thead>
                              <tbody>
                              {results.map((hit) => (
                                <tr > 
                                  {cols.map((col)=>(
                                    <>
                                    {((col !== 'Report_ID_ES') && (col !== 'Name_of_policy_or_measure'))? 
                                      (
                                        <td key={col}>
                                          <div style={{width:200+'px', overflow:'hidden', height:'30px'}}>
                                            {hit[col]?.raw}
                                          </div>
                                        </td>)
                                      :
                                      (
                                        <>
                                        {(col === 'Name_of_policy_or_measure')?
                                          (
                                            <td>
                                              <a href={hit['Report_ID_ES']?.raw}>{hit[col]?.raw}</a>
                                            </td>
                                          ):(<></>)
                                        }
                                        </>
                                      )
                                      }
                                    
                                    </>
                                  ))}
                                </tr>
                                ))}
                              </tbody>
                            </table>
                        </div>
                      );
                    }}
                  </WithSearch>                  
            
                }
                bodyHeader={
                  <React.Fragment>
                    {wasSearched && <PagingInfo />}
                    {wasSearched && <ResultsPerPage />}
                  </React.Fragment>
                }
                bodyFooter={<Paging />}
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
