import ComparisonOperator from "../types/ComparisonOperator";
import * as funcOps from "./wrappedComparisonOperators";

export default {
	[ComparisonOperator.EqualTo]: funcOps.EqualTo,
	[ComparisonOperator.NotEqualTo]: funcOps.NotEqualTo,
	[ComparisonOperator.GreaterThan]: funcOps.GreaterThan,
	[ComparisonOperator.LessThan]: funcOps.LessThan,
	[ComparisonOperator.GreaterThanOrEqualTo]: funcOps.GreaterThanOrEqualTo,
	[ComparisonOperator.LessThanOrEqualTo]: funcOps.LessThanOrEqualTo
} as const;