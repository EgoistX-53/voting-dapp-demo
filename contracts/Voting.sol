pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string name;
        uint voteCount;
    }

    address public owner;
    mapping(address => bool) public hasVoted;
    Proposal[] public proposals;

    constructor(string[] memory proposalNames) {
        owner = msg.sender;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function vote(uint proposalIndex) public {
        require(!hasVoted[msg.sender], "You already voted.");
        require(proposalIndex < proposals.length, "Invalid proposal index");

        hasVoted[msg.sender] = true;
        proposals[proposalIndex].voteCount++;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
