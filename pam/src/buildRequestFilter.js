function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === "false" || fieldValue === "true") {
    return { [field]: fieldValue === "true" };
  }

  return { [`${field}`]: fieldValue };
}

function getTermFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: filter.values.map(filterValue => ({
          term: getTermFilterValue(filter.field, filterValue)
        })),
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: filter.values.map(filterValue => ({
          term: getTermFilterValue(filter.field, filterValue)
        }))
      }
    };
  }
}

function getRangeFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: filter.values.map(filterValue => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from })
            }
          }
        })),
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: filter.values.map(filterValue => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from })
            }
          }
        }))
      }
    };
  }
}

export default function buildRequestFilter(filters) {
  if (!filters) return;

  filters = filters.reduce((acc, filter) => {
    if (["Country", "GHG_s__affected", "Single_policy_or_measure__or_group_of_measures","Sector_s__affected","Objective_s__lookup_only4facets","Type_of_policy_instrument","Status_of_implementation","Entities_responsible_for_implementing_the_policy__type_","Implementation_period_start","Is_the_policy_or_measure_related_to_a_Union_policy_","Union_policies_lookup_only4facets","Projection_scenario_in_which_the_policy_or_measure_is_included","Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions"].includes(filter.field)) {

      

      return [...acc, getTermFilter(filter)];
    }
    return acc;
  }, []);

  if (filters.length < 1) return;
  return filters;
}
