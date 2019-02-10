pragma solidity ^0.4.24;

import "./Roles.sol";

contract DeveloperRole {
    using Roles for Roles.Role;

    event DeveloperAdded(address indexed account);
    event DeveloperRemoved(address indexed account);

    Roles.Role private developers;

    constructor() public {
        _addDeveloper(msg.sender);
    }

    modifier onlyDeveloper() {
        require(isDeveloper(msg.sender), "This function can only be performed by Developer.");
        _;
    }

    function isDeveloper(address account) public view returns (bool) {
        return developers.has(account);
    }

    function addDeveloper(address account) public {
        _addDeveloper(account);
    }

    function renounceDeveloper() public {
        _removeDeveloper(msg.sender);
    }

    function _addDeveloper(address account) internal {
        developers.add(account);
        emit DeveloperAdded(account);
    }

    function _removeDeveloper(address account) internal {
        developers.remove(account);
        emit DeveloperRemoved(account);
    }
}
