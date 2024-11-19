// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonation {
    address public owner;

    struct Goal {
        string description;
        uint amount;
        uint raised;
        bool completed;
    }

    Goal[] public goals;

    event GoalCreated(uint goalId, string description, uint amount);
    event GoalDeleted(uint goalId);
    event DonationReceived(uint goalId, address donor, uint amount);
    event Withdrawn(uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createGoal(string memory description, uint amount) public {
    require(amount > 0, "Amount should be greater than zero.");
    goals.push(Goal({
        description: description,
        amount: amount,
        raised: 0,
        completed: false
    }));
    emit GoalCreated(goals.length - 1, description, amount);
}


    function deleteGoal(uint goalId) public onlyOwner {
        require(goalId < goals.length, "Goal does not exist.");
        
        // Move the last goal to the position of the goal to delete and then pop the last element
        goals[goalId] = goals[goals.length - 1];
        goals.pop();

        emit GoalDeleted(goalId);
    }

    function donate(uint goalId) public payable {
        require(goalId < goals.length, "Goal does not exist.");
        require(msg.value > 0, "Donation amount should be greater than zero.");

        goals[goalId].raised += msg.value;
        if (goals[goalId].raised >= goals[goalId].amount) {
            goals[goalId].completed = true;
        }

        emit DonationReceived(goalId, msg.sender, msg.value);
    }

    function withdraw(uint amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance.");
        payable(owner).transfer(amount);
        emit Withdrawn(amount);
    }

    function getGoals() public view returns (Goal[] memory) {
        return goals;
    }
}
