pragma solidity ^0.4.24;

import "./Roles.sol";

contract TesterRole {
    using Roles for Roles.Role;

    event TesterAdded(address indexed account);
    event TesterRemoved(address indexed account);

    Roles.Role private testers;

    constructor() public {
        _addTester(msg.sender);
    }

    modifier onlyTester() {
        require(isTester(msg.sender), "This function can only be performed by Tester.");
        _;
    }

    function isTester(address account) public view returns (bool) {
        return testers.has(account);
    }

    function addTester(address account) public {
        _addTester(account);
    }

    function renounceTester() public {
        _removeTester(msg.sender);
    }

    function _addTester(address account) internal {
        testers.add(account);
        emit TesterAdded(account);
    }

    function _removeTester(address account) internal {
        testers.remove(account);
        emit TesterRemoved(account);
    }
}
