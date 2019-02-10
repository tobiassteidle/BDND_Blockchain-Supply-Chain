pragma solidity ^0.4.24;

import "./Roles.sol";

contract CustomerRole {
    using Roles for Roles.Role;

    event CustomerAdded(address indexed account);
    event CustomerRemoved(address indexed account);

    Roles.Role private customers;

    constructor() public {
        _addCustomer(msg.sender);
    }

    modifier onlyCustomer() {
        require(isCustomer(msg.sender), "This function can only be performed by customer.");
        _;
    }

    function isCustomer(address account) public view returns (bool) {
        return customers.has(account);
    }

    function addCustomer(address account) public {
        _addCustomer(account);
    }

    function renounceCustomer() public {
        _removeCustomer(msg.sender);
    }

    function _addCustomer(address account) internal {
        customers.add(account);
        emit CustomerAdded(account);
    }

    function _removeCustomer(address account) internal {
        customers.remove(account);
        emit CustomerRemoved(account);
    }
}
