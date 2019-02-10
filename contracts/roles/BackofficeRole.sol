pragma solidity ^0.4.24;

import "./Roles.sol";

contract BackofficeRole {
    using Roles for Roles.Role;

    event BackofficeAdded(address indexed account);
    event BackofficeRemoved(address indexed account);

    Roles.Role private backoffices;

    constructor() public {
        _addBackoffice(msg.sender);
    }

    modifier onlyBackoffice() {
        require(isBackoffice(msg.sender), "This function can only be performed by Backoffice.");
        _;
    }

    function isBackoffice(address account) public view returns (bool) {
        return backoffices.has(account);
    }

    function addBackoffice(address account) public {
        _addBackoffice(account);
    }

    function renounceBackoffice() public {
        _removeBackoffice(msg.sender);
    }

    function _addBackoffice(address account) internal {
        backoffices.add(account);
        emit BackofficeAdded(account);
    }

    function _removeBackoffice(address account) internal {
        backoffices.remove(account);
        emit BackofficeRemoved(account);
    }
}
