// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract XaiDaoRegister {

    address public xmtpAddress;
    address public owner;
    bytes32 public validContractHash;

    address[] public daos;

    constructor(address _xmtpAddress, bytes32 _validContractHash) {
        require(_xmtpAddress != address(0), "Invalid XMTP address");
        xmtpAddress = _xmtpAddress;
        validContractHash = _validContractHash;
    }

    function toHexString(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i * 2] = alphabet[uint8(data[i] >> 4)];
            str[1 + i * 2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }

    function verifyNewDao() public {
//        require(
//            msg.sender.codehash == validContractHash,
//            string(abi.encodePacked(
//                "Invalid contract hash: ",
//                toHexString(msg.sender.codehash)
//            ))
//        );
        daos.push(msg.sender);
    }

    function getDaos() public view returns (address[] memory) {
        return daos;
    }

    function setOwner(address _owner) public {
        require(msg.sender == owner, "Only owner can call this function");
        owner = _owner;
    }

    function setXMTPAddress(address _xmtpAddress) public {
        require(msg.sender == owner, "Only owner can call this function");
        require(_xmtpAddress != address(0), "Invalid XMTP address");
        xmtpAddress = _xmtpAddress;
    }
}
