pragma solidity ^0.4.24;

import "../core/Ownable.sol";
import "../roles/CustomerRole.sol";
import "../roles/BackofficeRole.sol";
import "../roles/DeveloperRole.sol";
import "../roles/ReviewerRole.sol";
import "../roles/TesterRole.sol";

contract SupplyChain is Ownable, CustomerRole, BackofficeRole, DeveloperRole, ReviewerRole, TesterRole {

    uint  current_fid;

    mapping (uint => Feature) features;

    enum State
    {
        New,        // 0
        Offered,    // 1
        Accepted,   // 2
        Developed,  // 3
        Reviewed,   // 4
        Tested,     // 5
        Invoiced,   // 6
        Payed       // 7
    }

    struct Feature {
        uint fid;
        string topic;
        string description;
        uint price;
        State state;
        address customerID;
        address backofficeID;
        address developerID;
        address reviewerID;
        address testerID;
    }

    event New(uint fid);
    event Offered(uint fid);
    event Accepted(uint fid);
    event Developed(uint fid);
    event Reviewed(uint fid);
    event Tested(uint fid);
    event Invoiced(uint fid);
    event Payed(uint fid);


    modifier checkValue(uint _fid) {
        _;
        uint _price = features[_fid].price;
        uint amountToRefund = msg.value - _price;
        features[_fid].customerID.transfer(amountToRefund);
    }


    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "Invoice not paid in full.");
        _;
    }

    modifier isNewFeature(uint _fid) {
        require(features[_fid].state == State.New, "This function can only be performed in State 'New'.");
        _;
    }

    modifier isOffered(uint _fid) {
        require(features[_fid].state == State.Offered, "This function can only be performed in State 'Offered'.");
        _;
    }

    modifier isOfferAccepted(uint _fid) {
        require(features[_fid].state == State.Accepted, "This function can only be performed in State 'Accepted'.");
        _;
    }

    modifier isDeveloped(uint _fid) {
        require(features[_fid].state == State.Developed, "This function can only be performed in State 'Developed'.");
        _;
    }

    modifier isReviewOK(uint _fid) {
        require(features[_fid].state == State.Reviewed, "This function can only be performed in State 'Reviewed'.");
        _;
    }

    modifier isTestOK(uint _fid) {
        require(features[_fid].state == State.Tested, "This function can only be performed in State 'Tested'.");
        _;
    }

    modifier isInvoicedSend(uint _fid) {
        require(features[_fid].state == State.Invoiced);
        _;
    }

    constructor() public payable {
        current_fid = 0;
    }

    function kill() public onlyOwner {
        selfdestruct(msg.sender);
    }

    function requestFeature(string _topic, string _description) public onlyCustomer returns (uint fid) {
        current_fid = current_fid + 1;

        Feature memory newFeature = Feature(current_fid, _topic, _description, 0, State.New, msg.sender, 0x0, 0x0, 0x0, 0x0);
        features[current_fid] = newFeature;

        emit New(current_fid);

        fid = current_fid;
    }

    function sendOffer(uint _fid, uint _price) public isNewFeature(_fid) onlyBackoffice {
        Feature storage feature = features[_fid];

        feature.price = _price;
        feature.state = State.Offered;
        feature.backofficeID = msg.sender;

        emit Offered(_fid);
    }

    function startDevelopment(uint _fid) public isOffered(_fid) onlyCustomer {
        Feature storage feature = features[_fid];

        feature.state = State.Accepted;

        emit Accepted(_fid);
    }

    function startReview(uint _fid) public isOfferAccepted(_fid) onlyDeveloper {
        Feature storage feature = features[_fid];

        feature.state = State.Developed;
        feature.developerID = msg.sender;

        emit Developed(_fid);
    }

    function startTest(uint _fid) public isDeveloped(_fid) onlyReviewer {
        Feature storage feature = features[_fid];

        feature.state = State.Reviewed;
        feature.reviewerID = msg.sender;

        emit Reviewed(_fid);
    }

    function writeInvoice(uint _fid) public isReviewOK(_fid) onlyTester {
        Feature storage feature = features[_fid];

        feature.state = State.Tested;
        feature.testerID = msg.sender;

        emit Tested(_fid);
    }

    function sendInvoice(uint _fid) public isTestOK(_fid) onlyBackoffice {
        Feature storage feature = features[_fid];

        feature.state = State.Invoiced;

        emit Invoiced(_fid);
    }

    function pay(uint _fid) public isInvoicedSend(_fid) onlyCustomer paidEnough(features[_fid].price) checkValue(_fid) payable {
        Feature storage feature = features[_fid];

        feature.state = State.Payed;
        feature.backofficeID.transfer(feature.price);

        emit Payed(_fid);
    }

    function fetchFeature(uint _fid) public view returns
    (
        uint fid,
        string topic,
        string description,
        uint price,
        State state,
        address customerID,
        address backofficeID,
        address developerID,
        address reviewerID,
        address testerID
    )
    {
        Feature memory feature = features[_fid];

        fid = feature.fid;
        topic = feature.topic;
        description = feature.description;
        price = feature.price;
        state = feature.state;
        customerID = feature.customerID;
        backofficeID = feature.backofficeID;
        developerID = feature.developerID;
        reviewerID = feature.reviewerID;
        testerID = feature.testerID;
    }
}
