import buildRequestFilter from "./buildRequestFilter";

function buildFrom(current, resultsPerPage) {
  if (!current || !resultsPerPage) return;
  return (current - 1) * resultsPerPage;
}

function buildSort(sortDirection, sortField) {
  if (sortDirection && sortField) {
    return [{ [`${sortField}`]: sortDirection }];
  }
}

function buildMatch(searchTerm) {
  return searchTerm
    ? {
        multi_match: {
          query: searchTerm,
          fields: ["all_fields_for_freetext"]
        }
      }
    : { match_all: {} };
}

/*

  Converts current application state to an Elasticsearch request.

  When implementing an onSearch Handler in Search UI, the handler needs to take the
  current state of the application and convert it to an API request.

  For instance, there is a "current" property in the application state that you receive
  in this handler. The "current" property represents the current page in pagination. This
  method converts our "current" property to Elasticsearch's "from" parameter.

  This "current" property is a "page" offset, while Elasticsearch's "from" parameter
  is a "item" offset. In other words, for a set of 100 results and a page size
  of 10, if our "current" value is "4", then the equivalent Elasticsearch "from" value
  would be "40". This method does that conversion.

  We then do similar things for searchTerm, filters, sort, etc.
*/
export default function buildRequest(state) {
  const {
    current,
    filters,
    resultsPerPage,
    searchTerm,
    sortDirection,
    sortField
  } = state;

  const sort = buildSort(sortDirection, sortField);
  const match = buildMatch(searchTerm);
  const size = resultsPerPage;
  const from = buildFrom(current, resultsPerPage);
  const filter = buildRequestFilter(filters);

  const body = {
    // Static query Configuration
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-highlighting.html
    highlight: {
      fragment_size: 200,
      number_of_fragments: 1,
      fields: {
        Country: {}
      }
    },
    //https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-source-filtering.html#search-request-source-filtering
    _source: [
      "Country",
      "ID_of_policy_or_measure",
      "Report_ID_ES",
      "Name_of_policy_or_measure",
      "Single_policy_or_measure__or_group_of_measures",
      "Policies_or_measures_included_in_the_group",
      "Type_of_policy_instrument",
      "Status_of_implementation",
      "Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions",
      "Sector_s__affected",
      "Objective_s_",
      "Total_GHG_emissions_reductions_in_2020__kt_CO2eq_y_",
      "Total_GHG_emissions_reductions_in_2030__kt_CO2eq_y_",
      "Entities_responsible_for_implementing_the_policy",
      "Implementation_period_start",
      "Is_the_policy_or_measure_related_to_a_Union_policy_",
      "Related_Union_Policy",
      "GHG_s__affected",
      "Projection_scenario_in_which_the_policy_or_measure_is_included",
      "Description",
      "Quantified_objective",
      "Implementation_period_finish",
      "Indicator_used_to_monitor_and_evaluate_progress_over_time",
      "General_comment",
      "Main_reference",
      "URL_to_main_reference",
      "GHG_emissions_reductions_EU_ETS_in_2020__kt_CO2eq_y_",
      "GHG_emissions_reductions_ESD_in_2020__kt_CO2eq_y_",
      "GHG_emissions_reductions_EU_ETS_in_2025__kt_CO2eq_y_",
      "GHG_emissions_reductions_ESD_in_2025__kt_CO2eq_y_",
      "Total_GHG_emissions_reductions_in_2025__kt_CO2eq_y_",
      "GHG_emissions_reductions_EU_ETS_in_2030__kt_CO2eq_y_",
      "GHG_emissions_reductions_ESD_in_2030__kt_CO2eq_y_",
      "GHG_emissions_reductions_EU_ETS_in_2035__kt_CO2eq_y_",
      "GHG_emissions_reductions_ESD_in_2035__kt_CO2eq_y_",
      "Total_GHG_emissions_reductions_in_2035__kt_CO2eq_y_",
      "Reference_for_ex_ante_assessment",
      "Web_link_for_ex_ante_assessment",
      "Year_for_which_reduction_applies__ex_post_",
      "Average_ex_post_emission_reduction__kt_CO2eq_y_",
      "Explanation_of_the_basis_for_the_mitigation_estimates",
      "Factors_affected_by_the_policy_or_measure",
      "Reference_for_ex_post_assessment",
      "Web_link_for_ex_post_assessment",
      "Projected_costs__EUR_per_tonne_CO2eq_reduced__sequestered_",
      "Projected_absolute_costs_per_year__EUR_",
      "Year_projected_cost_has_been_calculated_for",
      "Price_reference_year__projected_costs_",
      "Projected_benefits__EUR_per_tonne_CO2eq_reduced__sequestered_",
      "Projected_absolute_benefit_per_year__EUR_",
      "Projected_net_costs__EUR_per_tonne_CO2eq_reduced__sequestered_",
      "Projected_net_cost_per_year__EUR_",
      "Description_of_projected_cost_estimates",
      "Reference_for_projected_costs_and_benefits",
      "Web_link_for_projected_costs_and_benefits",
      "Realised_costs___EUR_per_tonne_CO2eq_reduced__sequestered_",
      "Realised_absolute_costs_per_year__EUR_",
      "Year_realised_cost_has_been_calculated_for",
      "Price_reference_year__realised_costs_",
      "Realised_benefits__EUR_per_tonne_CO2eq_reduced__sequestered_",
      "Realised_absolute_benefit_per_year__EUR_",
      "Realised_net_costs__EUR_per_tonne_CO2eq_reduced__sequestered_",
      "Realised_net_cost_per_year__EUR_",
      "Description_of_realised_cost_estimates",
      "Reference_for_realised_costs_and_benefits",
      "Web_link_for_realised_costs_and_benefits",
      "Report_ID",
      "Objective_s__lookup_only4facets",
      "Entities_responsible_for_implementing_the_policy__type_",
      "Union_policies_lookup_only4facets",
      "Link_to_national_report",
    ],
    aggs: {
      Country: { terms: { field: "Country", size: 30 } },
      Single_policy_or_measure__or_group_of_measures: { terms: { field: "Single_policy_or_measure__or_group_of_measures", size: 30 } },
      GHG_s__affected: { terms: { field: "GHG_s__affected", size: 30 } },
      Sector_s__affected: { terms: { field: "Sector_s__affected", size: 30 } },
      Objective_s__lookup_only4facets: { terms: { field: "Objective_s__lookup_only4facets", size: 30 } },
      Type_of_policy_instrument: { terms: { field: "Type_of_policy_instrument", size: 30 } },
      Status_of_implementation: { terms: { field: "Status_of_implementation", size: 30 } },
      Entities_responsible_for_implementing_the_policy__type_: { terms: { field: "Entities_responsible_for_implementing_the_policy__type_", size: 30 } },
      Implementation_period_start: { terms: { field: "Implementation_period_start", size: 30 } },
      Is_the_policy_or_measure_related_to_a_Union_policy_: { terms: { field: "Is_the_policy_or_measure_related_to_a_Union_policy_", size: 30 } },
      Union_policies_lookup_only4facets: { terms: { field: "Union_policies_lookup_only4facets", size: 30 } },
      Projection_scenario_in_which_the_policy_or_measure_is_included: { terms: { field: "Projection_scenario_in_which_the_policy_or_measure_is_included", size: 30 } },
      Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions: { terms: { field: "Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions", size: 30 } }
    },

    // Dynamic values based on current Search UI state
    // --------------------------
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/full-text-queries.html
    query: {
      bool: {
        must: [match],
        ...(filter && { filter })
      }
    },
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-sort.html
    ...(sort && { sort }),
    // https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-request-from-size.html
    ...(size && { size }),
    ...(from && { from })
  };

  return body;
}
