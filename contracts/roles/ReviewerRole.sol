pragma solidity ^0.4.24;

import "./Roles.sol";

contract ReviewerRole {
    using Roles for Roles.Role;

    event ReviewerAdded(address indexed account);
    event ReviewerRemoved(address indexed account);

    Roles.Role private reviewers;

    constructor() public {
        _addReviewer(msg.sender);
    }

    modifier onlyReviewer() {
        require(isReviewer(msg.sender), "This function can only be performed by Reviewer.");
        _;
    }

    function isReviewer(address account) public view returns (bool) {
        return reviewers.has(account);
    }

    function addReviewer(address account) public {
        _addReviewer(account);
    }

    function renounceReviewer() public {
        _removeReviewer(msg.sender);
    }

    function _addReviewer(address account) internal {
        reviewers.add(account);
        emit ReviewerAdded(account);
    }

    function _removeReviewer(address account) internal {
        reviewers.remove(account);
        emit ReviewerRemoved(account);
    }
}
