import { DistrictProfile, PriorityWeights, ComputedPriorityScore, CategoryType } from '../types';

/**
 * Computes the transparent Priority Score per district and category:
 * score = w1 * citizen_demand_norm + w2 * infrastructure_gap_norm + w3 * vulnerability_norm - w4 * existing_investment_norm
 * Normalized to 0 - 100 for intuitive policymaker assessment.
 */
export function calculateDistrictPriorities(
  districts: DistrictProfile[],
  weights: PriorityWeights,
  selectedCategory: CategoryType | 'composite' = 'composite'
): ComputedPriorityScore[] {
  // Find max bounds for normalization
  const maxDemand = Math.max(...districts.map(d => d.requestVolume), 1);
  const maxInvestment = Math.max(...districts.map(d => d.existingPublicInvestmentCr.total), 1);

  const results: ComputedPriorityScore[] = districts.map((district) => {
    // 1. Citizen Demand Component (0 - 100)
    // Factoring digital penetration bias: remote/tribal districts with low smartphone penetration
    // get a fair compensation factor so that low-connectivity areas are not penalized!
    const digitalDivideMultiplier = district.flaggedUnderrepresented ? (100 / Math.max(district.digitalPenetrationPct, 20)) * 0.45 : 1.0;
    const adjustedDemand = district.requestVolume * digitalDivideMultiplier;
    const normDemand = Math.min(100, (adjustedDemand / maxDemand) * 100);

    // 2. Infrastructure Gap Component (0 - 100)
    const gapScore = selectedCategory === 'composite' 
      ? district.infrastructureGaps.composite 
      : (district.infrastructureGaps[selectedCategory] || district.infrastructureGaps.composite);

    // 3. Vulnerability Component (0 - 100)
    // Derived from SC/ST, poverty, low literacy, rural share
    const vulnScore = district.vulnerabilityScore;

    // 4. Existing Public Investment Deduction (0 - 100)
    // High allocation under PM Gati Shakti / JJM lowers the immediate urgency for new capital,
    // directing scarce national funds to under-allocated districts.
    const normInvestment = (district.existingPublicInvestmentCr.total / maxInvestment) * 100;

    // Raw weighted sum
    const totalWeights = (weights.citizenDemand + weights.infrastructureGap + weights.vulnerability) || 1;
    
    const demandPart = weights.citizenDemand * normDemand;
    const gapPart = weights.infrastructureGap * gapScore;
    const vulnPart = weights.vulnerability * vulnScore;
    const investPart = weights.investmentOffset * normInvestment;

    const rawScore = demandPart + gapPart + vulnPart - investPart;
    // Normalize into a 0 - 100 scale
    const boundedScore = Math.max(5, Math.min(99.5, Number((rawScore / totalWeights).toFixed(1))));

    return {
      districtId: district.id,
      districtName: district.name,
      state: district.state,
      category: selectedCategory,
      score: boundedScore,
      demandComponent: Number(demandPart.toFixed(1)),
      gapComponent: Number(gapPart.toFixed(1)),
      vulnerabilityComponent: Number(vulnPart.toFixed(1)),
      investmentDeduction: Number(investPart.toFixed(1)),
      rank: 0, // Will be computed after sorting
      demandVolume: district.requestVolume,
      gapIndex: gapScore,
      allocationCr: district.existingPublicInvestmentCr.total
    };
  });

  // Sort descending by score and assign ranks
  results.sort((a, b) => b.score - a.score);
  results.forEach((item, index) => {
    item.rank = index + 1;
  });

  return results;
}
