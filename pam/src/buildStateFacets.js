function getValueFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "value",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: bucket.key_as_string || bucket.key,
          count: bucket.doc_count
        }))
      }
    ];
  }
}

function getRangeFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "range",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key
          },
          count: bucket.doc_count
        }))
      }
    ];
  }
}

export default function buildStateFacets(aggregations) {
  const Country = getValueFacet(aggregations, "Country");
  const GHG_s__affected = getValueFacet(aggregations, "GHG_s__affected");
  const Single_policy_or_measure__or_group_of_measures = getValueFacet(aggregations, "Single_policy_or_measure__or_group_of_measures");
  const Sector_s__affected = getValueFacet(aggregations, "Sector_s__affected");
  const Objective_s__lookup_only4facets = getValueFacet(aggregations, "Objective_s__lookup_only4facets");
  const Type_of_policy_instrument = getValueFacet(aggregations, "Type_of_policy_instrument");
  const Status_of_implementation = getValueFacet(aggregations, "Status_of_implementation");
  const Entities_responsible_for_implementing_the_policy__type_ = getValueFacet(aggregations, "Entities_responsible_for_implementing_the_policy__type_");
  const Implementation_period_start = getValueFacet(aggregations, "Implementation_period_start");
  const Is_the_policy_or_measure_related_to_a_Union_policy_ = getValueFacet(aggregations, "Is_the_policy_or_measure_related_to_a_Union_policy_");
  const Union_policies_lookup_only4facets = getValueFacet(aggregations, "Union_policies_lookup_only4facets");
  const Projection_scenario_in_which_the_policy_or_measure_is_included = getValueFacet(aggregations, "Projection_scenario_in_which_the_policy_or_measure_is_included");
  const Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions = getValueFacet(aggregations, "Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions");

const facets = {
    ...(Country && { Country }),
    ...(GHG_s__affected && { GHG_s__affected }),
    ...(Single_policy_or_measure__or_group_of_measures && { Single_policy_or_measure__or_group_of_measures }),
    ...(Sector_s__affected && { Sector_s__affected }),
    ...(Objective_s__lookup_only4facets && { Objective_s__lookup_only4facets }),
    ...(Type_of_policy_instrument && { Type_of_policy_instrument }),
    ...(Status_of_implementation && { Status_of_implementation }),
    ...(Entities_responsible_for_implementing_the_policy__type_ && { Entities_responsible_for_implementing_the_policy__type_ }),
    ...(Implementation_period_start && { Implementation_period_start }),
    ...(Is_the_policy_or_measure_related_to_a_Union_policy_ && { Is_the_policy_or_measure_related_to_a_Union_policy_ }),
    ...(Union_policies_lookup_only4facets && { Union_policies_lookup_only4facets }),
    ...(Projection_scenario_in_which_the_policy_or_measure_is_included && { Projection_scenario_in_which_the_policy_or_measure_is_included }),
    ...(Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions && { Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions })

  };

  if (Object.keys(facets).length > 0) {
    return facets;
  }
}
