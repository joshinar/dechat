pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Dechat is ERC721 {
    address payable public owner;
    uint public totalChannels;
    uint public totalSupply;
    struct Channel {
        uint id;
        string name;
        uint cost;
    }
    mapping(uint => Channel) public channels;
    mapping(uint => mapping(address => bool)) public hasJoined;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = payable(msg.sender);
    }

    modifier _onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner of the smart contract is allowed to perform this transaction"
        );
        _;
    }

    function createChannel(string memory _name, uint _cost) public _onlyOwner {
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost);
    }

    function mint(uint _id) public payable {
        require(_id != 0 && _id <= totalChannels);
        require(msg.value >= channels[_id].cost);
        require(
            hasJoined[_id][msg.sender] = false,
            "already minted and joined"
        );
        hasJoined[_id][msg.sender] = true;
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function withdraw() public _onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
