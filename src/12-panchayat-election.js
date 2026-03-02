/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const votes = {};
  const registeredVoters = new Set();
  const votedVoters = new Set();

  const returningObj = {
    registerVoter(voter){
      if(typeof voter !== "object" || voter === null) return false;

      let isValid;
      for(let key of Object.keys(voter)){
        if(["id","name","age"].includes(key)){
          isValid = true;
        }else{
          isValid = false;
        }
      }

      if(! isValid) return false;

      if(voter.age < 18) return false;

      const isAlreadyVoter = [...registeredVoters].some((registerVoter) => registerVoter.id === voter.id);
      if(isAlreadyVoter) return false;
      registeredVoters.add(voter);

      return true;
    },

    castVote(voterId, candidateId, onSuccess, onError){
      const isRegistered = [...registeredVoters].some((voter) => voter.id === voterId);
      const isCandidateExist = candidates.some((candidate) => candidate.id === candidateId);
      const isVoted = votedVoters.has(voterId)
      if(isRegistered && isCandidateExist && ! isVoted){
        votedVoters.add(voterId)
        votes[candidateId] = (votes[candidateId] || 0) + 1
        return onSuccess({voterId, candidateId});
      }
      return onError("reason string");

    },

    getResults(sortFn){
      const returningArr = candidates.map((candidate) => {
        const voteCount = votes[candidate.id] || 0;
        return {id: candidate.id, name: candidate.name, party:candidate.party, votes:voteCount}
      })
      if(sortFn){
        return returningArr.sort(sortFn);
      }

      return returningArr.sort((a,b) => b.votes - a.votes);
    },

    getWinner(){
      if(votedVoters.size === 0) return null;
      const sortedArr = this.getResults();
      return sortedArr[0];
    }
  }
  return returningObj
}

export function createVoteValidator(rules) {
  return function(voter){
    if(voter.age < rules.minAge){
      return {valid:false, reason:"Age is less than the minimum age."}
    }
    const isRequiredFieldsPresent = rules.requiredFields.every((field) => Object.keys(voter).includes(field))

    if(! isRequiredFieldsPresent){
      return {valid:false, reason:"All fields are not present"}
    }

    return {valid: true, reason:"Valid voter"}
  }
}

export function countVotesInRegions(regionTree) {
 if(typeof regionTree !== "object" || regionTree === null ||typeof regionTree.votes !== "number" ){
  return 0;
 }

 let total = regionTree.votes;
 if(! Array.isArray(regionTree.subRegions) || regionTree.subRegions.length === 0){
  return total;
 }

 for (const subregion of regionTree.subRegions){
  total += countVotesInRegions(subregion);
 }

 return total;
}


export function tallyPure(currentTally, candidateId) {
  const copy = {...currentTally}
  copy[candidateId] = (copy[candidateId] || 0)+1;
  return copy
}
