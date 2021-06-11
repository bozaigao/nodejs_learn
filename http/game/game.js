
/*
 * @Author: 波仔糕
 * @LastModifiedBy: 波仔糕
 */
function game(playAction) {
  if (["rock", "scissor", "paper"].indexOf(playAction) === -1) {
    throw new Error("invalid playAction");
  }
  const random = Math.random() * 3;
  let machineAction = "";
  if (random < 1) {
    machineAction = "rock";
  } else if (random < 2) {
    machineAction = "scissor";
  } else {
    machineAction = "paper";
  }

  if (machineAction === playAction) return 0;

  if (
    (machineAction === "rock" && playAction === "scissor") ||
    (machineAction === "scissor" && playAction === "paper") ||
    (machineAction === "paper" && playAction === "rock")
  ) {
    return -1;
  } else {
    return 1;
  }
}
module.exports = game;