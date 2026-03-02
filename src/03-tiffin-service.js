/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  if(! ["veg", "nonveg", "jain"].includes(mealType)) return null;

  if(! name || typeof name !== "string" || name.trim === "") return null;

  let price = 0;
  switch (mealType){
    case "veg":
      price = 80;
      break;
    
    case "nonveg":
      price = 120;
      break;

    case "jain":
      price = 90;
      break;
  }

  const totalCost = price*days;
  return {name, mealType, days, dailyRate: price, totalCost};
}

export function combinePlans(...plans) {
  if(plans.length === 0) return null;

  const result = plans.reduce((acc, curr) => {
    acc["totalCustomers"]++;
    const {totalCost, mealType} = createTiffinPlan(curr);
    acc["totalRevenue"] += totalCost;
    acc["mealBreakdown"][mealType]++;
    return acc;

  }, {totalCustomers: 0, totalRevenue: 0, mealBreakdown: {veg:0, nonveg:0, jain:0}})

  return result
}

export function applyAddons(plan, ...addons) {
  if(plan === null ) return null;


  const {dailyRate, days} =  plan
  const newDailyRate = addons.reduce((acc, curr) => {
    acc["updatedDailyRate"] += curr["price"];
    acc["addonName"].push(curr["name"]);
    return acc;
  }, {addonName: [], updatedDailyRate: dailyRate})

  const totalCost = newDailyRate["updatedDailyRate"] * days;
  if(addons.length === 0){
    return {...plan, addonNames:[]}
  }
  return {...plan, dailyRate:newDailyRate["updatedDailyRate"], totalCost, addonNames: newDailyRate["addonName"] };
} 
